import mongoose from "mongoose";
import Order from "../models/Order.js";
import { getOverallOrderStatus } from "../utils/orderStatus.js";
import { createNotification } from "../utils/createNotification.js";

const STATUS_TRANSITIONS = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const isValidStatusTransition = (currentStatus, nextStatus) => {
  if (!currentStatus || !nextStatus) return false;
  if (currentStatus === nextStatus) return true;

  return STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus) || false;
};

const getAllowedNextStatuses = (currentStatus) => {
  const nextStatuses = STATUS_TRANSITIONS[currentStatus] || [];
  return [currentStatus, ...nextStatuses];
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const serializeSellerOrder = (order) => {
  const sellerQuantity = order.items.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  return {
    _id: order._id,
    userId: order.userId,
    sellerId: order.sellerId,
    sellerName: order.sellerName,
    shippingAddress: order.shippingAddress,
    paymentStatus: order.paymentStatus,
    overallStatus: order.overallStatus,
    sellerSummaryStatus: getOverallOrderStatus(order.items),
    orderNumber: order.orderNumber,
    sellerOrderRef: order.sellerOrderRef,
    createdAt: order.createdAt,
    sellerItems: order.items,
    sellerSubtotal: order.subtotal,
    sellerQuantity,
  };
};

const getCustomerNotificationContent = ({
  status,
  orderNumber,
  itemName,
  sellerName,
  trackingNumber = "",
}) => {
  const normalizedStatus = String(status || "").toLowerCase();
  const cleanTracking = String(trackingNumber || "").trim();

  if (normalizedStatus === "processing") {
    return {
      title: "Order update",
      message: `Your item "${itemName}" in order ${orderNumber} is now being processed by ${sellerName}.`,
    };
  }

  if (normalizedStatus === "shipped") {
    return {
      title: "Order shipped",
      message: cleanTracking
        ? `Your item "${itemName}" in order ${orderNumber} has been shipped by ${sellerName}. Tracking number: ${cleanTracking}.`
        : `Your item "${itemName}" in order ${orderNumber} has been shipped by ${sellerName}.`,
    };
  }

  if (normalizedStatus === "delivered") {
    return {
      title: "Order delivered",
      message: `Your item "${itemName}" in order ${orderNumber} has been delivered.`,
    };
  }

  if (normalizedStatus === "cancelled") {
    return {
      title: "Order cancelled",
      message: `Your item "${itemName}" in order ${orderNumber} was cancelled.`,
    };
  }

  return {
    title: "Order update",
    message: `Your item "${itemName}" in order ${orderNumber} has been updated to ${normalizedStatus}.`,
  };
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      sellerId: req.user._id,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const sellerOrders = orders.map((order) => serializeSellerOrder(order));

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      orders: sellerOrders,
    });
  } catch (error) {
    console.error("getSellerOrders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleSellerOrder = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.user._id,
    }).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order: serializeSellerOrder(order),
    });
  } catch (error) {
    console.error("getSingleSellerOrder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSellerOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { fulfillmentStatus, trackingNumber = "" } = req.body;

    if (!fulfillmentStatus) {
      return res.status(400).json({ message: "Fulfillment status is required" });
    }

    const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(fulfillmentStatus)) {
      return res.status(400).json({ message: "Invalid fulfillment status" });
    }

    const cleanTrackingNumber = trackingNumber.trim();

    if (["shipped", "delivered"].includes(fulfillmentStatus) && !cleanTrackingNumber) {
      return res.status(400).json({
        message: "Tracking number is required for shipped or delivered status",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      sellerId: req.user._id,
    }).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    const previousStatus = item.fulfillmentStatus;

    if (!isValidStatusTransition(previousStatus, fulfillmentStatus)) {
      return res.status(400).json({
        message: `You cannot change status from ${previousStatus} to ${fulfillmentStatus}`,
      });
    }

    item.fulfillmentStatus = fulfillmentStatus;
    item.trackingNumber = cleanTrackingNumber;

    if (["shipped", "delivered"].includes(fulfillmentStatus)) {
      item.fulfilledAt = new Date();
    } else {
      item.fulfilledAt = null;
    }

    order.overallStatus = getOverallOrderStatus(order.items);
    await order.save();

    const sellerQuantity = order.items.reduce(
      (total, entry) => total + Number(entry.quantity),
      0
    );

    if (previousStatus !== fulfillmentStatus) {
      const notificationContent = getCustomerNotificationContent({
        status: fulfillmentStatus,
        orderNumber: order.orderNumber,
        itemName: item.name,
        sellerName: order.sellerName || "the seller",
        trackingNumber: item.trackingNumber || "",
      });

      await createNotification({
        userId: order.userId?._id || order.userId,
        title: notificationContent.title,
        message: notificationContent.message,
        type: "order",
        link: "/dashboard/orders",
        meta: {
          orderNumber: order.orderNumber,
          sellerOrderRef: order.sellerOrderRef,
          itemName: item.name,
          fulfillmentStatus,
          trackingNumber: item.trackingNumber || "",
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Order item status updated successfully",
      order: {
        _id: order._id,
        userId: order.userId,
        sellerId: order.sellerId,
        sellerName: order.sellerName,
        shippingAddress: order.shippingAddress,
        paymentStatus: order.paymentStatus,
        overallStatus: order.overallStatus,
        sellerSummaryStatus: getOverallOrderStatus(order.items),
        orderNumber: order.orderNumber,
        sellerOrderRef: order.sellerOrderRef,
        createdAt: order.createdAt,
        sellerItems: order.items,
        sellerSubtotal: order.subtotal,
        sellerQuantity,
      },
    });
  } catch (error) {
    console.error("updateSellerOrderItemStatus error:", error);
    res.status(500).json({ message: error.message });
  }
};