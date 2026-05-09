import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { getOverallOrderStatus } from "../utils/orderStatus.js";
import { generateOrderIdentifiers } from "../utils/orderNumber.js";
import { createNotification } from "../utils/createNotification.js";

export const placeOrder = async (req, res) => {
  try {
    const { sellerId, items, shippingAddress } = req.body;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required for checkout" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    const productIds = items.map((item) => item.productId);

    const dbProducts = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).populate("sellerId", "name");

    const productMap = new Map(
      dbProducts.map((product) => [String(product._id), product])
    );

    let subtotal = 0;
    const normalizedItems = [];
    let orderSellerName = "";

    for (const cartItem of items) {
      const product = productMap.get(String(cartItem.productId));

      if (!product) {
        return res.status(404).json({
          message: `Product not found or inactive: ${cartItem.productId}`,
        });
      }

      if (String(product.sellerId?._id || product.sellerId) !== String(sellerId)) {
        return res.status(400).json({
          message: "Checkout can only include products from one seller",
        });
      }

      const quantity = Number(cartItem.quantity || 0);

      if (quantity < 1) {
        return res.status(400).json({ message: "Invalid product quantity" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`,
        });
      }

      const linePrice = Number(product.price) * quantity;
      subtotal += linePrice;
      orderSellerName = product.sellerId?.name || "Marketplace Seller";

      normalizedItems.push({
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || "",
        quantity,
        sellerId: product.sellerId?._id || product.sellerId,
        sellerName: product.sellerId?.name || "Marketplace Seller",
        category: product.category || "",
        fulfillmentStatus: "pending",
        trackingNumber: "",
        fulfilledAt: null,
      });
    }

    const shippingFee = subtotal >= 500 ? 0 : 25;
    const totalPrice = subtotal + shippingFee;

    const { orderNumber, sellerOrderRef } = await generateOrderIdentifiers(orderSellerName);

    const order = await Order.create({
      orderNumber,
      sellerOrderRef,
      userId: req.user._id,
      sellerId,
      sellerName: orderSellerName,
      items: normalizedItems,
      shippingAddress,
      subtotal,
      shippingFee,
      totalPrice,
      paymentStatus: "pending",
      overallStatus: getOverallOrderStatus(normalizedItems),
    });

    for (const orderItem of normalizedItems) {
      const product = productMap.get(String(orderItem.productId));
      if (product) {
        product.stock = product.stock - orderItem.quantity;
        await product.save();
      }
    }

    const customer = await User.findById(req.user._id).select("name");

    await createNotification({
      userId: req.user._id,
      title: "Order placed",
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      type: "order",
      link: "/dashboard/orders",
      meta: {
        orderNumber: order.orderNumber,
        sellerOrderRef: order.sellerOrderRef,
      },
    });

    await createNotification({
      userId: sellerId,
      title: "New order received",
      message: `You received a new order from ${customer?.name || "a customer"}.`,
      type: "seller",
      link: "/seller/orders",
      meta: {
        orderNumber: order.orderNumber,
        sellerOrderRef: order.sellerOrderRef,
        customerName: customer?.name || "",
      },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ message: error.message || "Failed to place order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = String(order.userId._id) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!orderStatus) {
      return res.status(400).json({ message: "Order status is required" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};