import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPinHouse,
  Save,
  Store,
  Truck,
  UserRound,
  Sparkles,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSingleSellerOrderApi,
  updateSellerOrderItemStatusApi,
} from "../../api/orderApi";

export default function SellerOrderDetailPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [trackingMap, setTrackingMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingItemId, setSavingItemId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSingleSellerOrderApi(id);
      const currentOrder = data.order;

      setOrder(currentOrder);

      const nextStatusMap = {};
      const nextTrackingMap = {};

      currentOrder.sellerItems.forEach((item) => {
        nextStatusMap[item._id] = item.fulfillmentStatus || "pending";
        nextTrackingMap[item._id] = item.trackingNumber || "";
      });

      setStatusMap(nextStatusMap);
      setTrackingMap(nextTrackingMap);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load seller order");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleSaveItem = async (itemId) => {

    const selectedStatus = statusMap[itemId];
    const currentItem = order?.sellerItems?.find((entry) => entry._id === itemId);

    if (!currentItem) {
      toast.error("Order item not found");
      return;
    }

    if (
      selectedStatus === currentItem.fulfillmentStatus &&
      (trackingMap[itemId] || "").trim() === (currentItem.trackingNumber || "").trim()
    ) {
      toast.error("No changes to save");
      return;
    }
    if (!itemId) {
      toast.error("This order item does not have a valid ID");
      return;
    }

    const trackingValue = (trackingMap[itemId] || "").trim();

    if (["shipped", "delivered"].includes(selectedStatus) && !trackingValue) {
      toast.error("Tracking number is required for shipped or delivered status");
      return;
    }

    try {
      setSavingItemId(itemId);

      const data = await updateSellerOrderItemStatusApi(id, itemId, {
        fulfillmentStatus: selectedStatus,
        trackingNumber: trackingValue,
      });

      setOrder(data.order);

      const refreshedStatusMap = {};
      const refreshedTrackingMap = {};

      data.order.sellerItems.forEach((item) => {
        refreshedStatusMap[item._id] = item.fulfillmentStatus || "pending";
        refreshedTrackingMap[item._id] = item.trackingNumber || "";
      });

      setStatusMap(refreshedStatusMap);
      setTrackingMap(refreshedTrackingMap);

      toast.success("Item status updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update item status");
    } finally {
      setSavingItemId(null);
    }
  };

  const getStatusClasses = (status) => {
    if (status === "delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (status === "shipped") return "bg-sky-50 text-sky-700 ring-sky-200";
    if (status === "processing") return "bg-amber-50 text-amber-700 ring-amber-200";
    if (status === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
    if (status === "mixed") return "bg-violet-50 text-violet-700 ring-violet-200";
    return "bg-slate-100 text-slate-700 ring-slate-200";
  };

  const STATUS_TRANSITIONS = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const getAllowedStatusOptions = (currentStatus) => {
    const nextStatuses = STATUS_TRANSITIONS[currentStatus] || [];
    return [currentStatus, ...nextStatuses];
  };

  const isFinalStatus = (status) => {
    return status === "delivered" || status === "cancelled";
  };

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Order not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_30%)]" />

        <div className="relative px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                <Sparkles size={15} />
                Seller Order Detail
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {order.sellerOrderRef || order.orderNumber || order._id}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <ReceiptText size={15} />
                Global Order: {order.orderNumber || order._id}
              </p>
            </div>

            <Link
              to="/seller/orders"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <UserRound size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Customer</h2>
              <p className="mt-1 text-sm text-slate-500">
                Buyer information for this seller order
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-900">Name:</span>{" "}
              {order.userId?.name || order.shippingAddress?.fullName || "-"}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-900">Email:</span>{" "}
              {order.userId?.email || order.shippingAddress?.email || "-"}
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-medium text-slate-900">Phone:</span>{" "}
              {order.shippingAddress?.phone || "-"}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <MapPinHouse size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Shipping Address</h2>
              <p className="mt-1 text-sm text-slate-500">
                Delivery destination for this order
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
            <p>{order.shippingAddress?.fullName || "-"}</p>
            <p>{order.shippingAddress?.address || "-"}</p>
            <p>
              {order.shippingAddress?.city || "-"},{" "}
              {order.shippingAddress?.state || "-"}{" "}
              {order.shippingAddress?.postalCode || "-"}
            </p>
            <p>{order.shippingAddress?.country || "-"}</p>
          </div>
        </div>
      </div>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Payment:{" "}
            <span className="font-semibold text-slate-950">{order.paymentStatus}</span>
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${getStatusClasses(
              order.sellerSummaryStatus
            )}`}
          >
            Your Summary Status: {order.sellerSummaryStatus}
          </span>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${getStatusClasses(
              order.overallStatus
            )}`}
          >
            Overall Order Status: {order.overallStatus}
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          Update only your seller items below. The overall order status updates automatically
          based on item-level fulfillment changes.
        </div>

        <div className="mt-6 space-y-5">
          {order.sellerItems.map((item) => {
            const originalStatus = item.fulfillmentStatus || "pending";
            const currentStatus = statusMap[item._id] || originalStatus;
            const allowedStatuses = getAllowedStatusOptions(originalStatus);
            const showTrackingField = ["shipped", "delivered"].includes(currentStatus);
            const disableStatusChange = isFinalStatus(originalStatus);

            return (
              <div
                key={item._id}
                className="rounded-[26px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-18 w-18 overflow-hidden rounded-2xl bg-slate-200">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Store size={14} />
                          <span>{item.sellerName}</span>
                        </div>

                        <h3 className="mt-2 text-lg font-semibold text-slate-950">
                          {item.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                            {item.category || "-"}
                          </span>
                          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-950">
                          {(item.price * item.quantity).toFixed(2)} $
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${getStatusClasses(
                        item.fulfillmentStatus
                      )}`}
                    >
                      {item.fulfillmentStatus}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[220px_1fr_auto]">
                    <select
                      value={currentStatus}
                      disabled={disableStatusChange}
                      onChange={(e) =>
                        setStatusMap((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {allowedStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>

                    {disableStatusChange ? (
                      <p className="text-xs text-slate-500">
                        This item is in a final status and can no longer be updated.
                      </p>
                    ) : null}

                    {showTrackingField ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Tracking Number"
                          value={trackingMap[item._id] || ""}
                          onChange={(e) =>
                            setTrackingMap((prev) => ({
                              ...prev,
                              [item._id]: e.target.value,
                            }))
                          }
                          className={`h-11 w-full rounded-2xl bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:bg-white ${!(trackingMap[item._id] || "").trim()
                            ? "border border-rose-300 focus:border-rose-400"
                            : "border border-slate-200 focus:border-teal-500"
                            }`}
                        />

                        {!(trackingMap[item._id] || "").trim() ? (
                          <p className="pl-1 text-xs text-rose-600">
                            Tracking number is required for shipped or delivered items.
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex h-11 items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-sm text-slate-400">
                        <Truck size={16} className="mr-2" />
                        Tracking number will be added after shipment
                      </div>
                    )}

                    <button
                      onClick={() => handleSaveItem(item._id)}
                      disabled={savingItemId === item._id || disableStatusChange}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={16} />
                      {savingItemId === item._id ? "Saving..." : "Save"}
                    </button>
                  </div>

                  {item.trackingNumber ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      Current Tracking Number:{" "}
                      <span className="font-semibold text-slate-950">
                        {item.trackingNumber}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Your items total:{" "}
            <span className="font-semibold text-slate-950">{order.sellerQuantity}</span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-teal-600" />
            <span className="text-2xl font-bold tracking-tight text-slate-950">
              {Number(order.sellerSubtotal || 0).toFixed(2)} $
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}