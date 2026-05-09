import { useEffect, useMemo, useState } from "react";
import {
  PackageCheck,
  Search,
  Store,
  Truck,
  Sparkles,
  ReceiptText,
} from "lucide-react";
import { getMyOrdersApi } from "../../api/orderApi";
import StatusBadge from "../../components/orders/StatusBadge";
import OrderStatCard from "../../components/orders/OrderStatCard";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getMyOrdersApi();
      const list = data.orders || [];
      setOrders(list);
      setFilteredOrders(list);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      setFilteredOrders(orders);
      return;
    }

    const next = orders.filter((order) => {
      const itemNames = order.items?.map((item) => item.name).join(" ") || "";
      const sellerNames =
        order.items?.map((item) => item.sellerName).join(" ") || "";

      return (
        order.orderNumber?.toLowerCase().includes(query) ||
        order.sellerName?.toLowerCase().includes(query) ||
        order.paymentStatus?.toLowerCase().includes(query) ||
        order.overallStatus?.toLowerCase().includes(query) ||
        itemNames.toLowerCase().includes(query) ||
        sellerNames.toLowerCase().includes(query)
      );
    });

    setFilteredOrders(next);
  }, [searchText, orders]);

  const totalOrders = orders.length;

  const activeOrders = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "processing", "shipped", "mixed"].includes(order.overallStatus)
    ).length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.overallStatus === "delivered").length;
  }, [orders]);

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <PackageCheck size={24} />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-950">
          No orders yet
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Orders placed through checkout will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <OrderStatCard
          label="Total Orders"
          value={totalOrders}
          hint="All orders you have placed"
        />
        <OrderStatCard
          label="Active Orders"
          value={activeOrders}
          hint="Pending to shipped"
        />
        <OrderStatCard
          label="Delivered"
          value={deliveredOrders}
          hint="Completed successfully"
        />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by order number, seller, item, or status..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-teal-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="space-y-5">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <ReceiptText size={15} />
                    Order Number
                  </div>

                  <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                    {order.orderNumber || order._id}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Seller: {order.sellerName || "Marketplace Seller"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    status={order.paymentStatus}
                    type="payment"
                    prefix="Payment"
                  />
                  <StatusBadge
                    status={order.overallStatus}
                    type="order"
                    prefix="Order"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-6">
              {order.items.map((item) => (
                <div
                  key={`${order._id}-${item._id || item.productId}`}
                  className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-950">
                        {item.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Store size={13} />
                        <span>{item.sellerName}</span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Qty: {item.quantity}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge
                          status={item.fulfillmentStatus}
                          type="order"
                          prefix="Item"
                        />

                        {item.trackingNumber ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200">
                            <Truck size={12} />
                            {item.trackingNumber}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Total
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-950">
                      {(item.price * item.quantity).toFixed(2)} $
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Order Total</span>
                <span className="text-2xl font-bold tracking-tight text-slate-950">
                  {Number(order.totalPrice || 0).toFixed(2)} $
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}