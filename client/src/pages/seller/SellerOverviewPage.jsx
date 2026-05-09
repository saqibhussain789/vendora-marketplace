import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  PackageCheck,
  Truck,
  Wallet,
  ArrowRight,
  Store,
  ShoppingCart,
  UserCircle2,
} from "lucide-react";
import { getSellerOrdersApi } from "../../api/orderApi";
import StatusBadge from "../../components/orders/StatusBadge";
import OrderStatCard from "../../components/orders/OrderStatCard";

export default function SellerOverviewPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getSellerOrdersApi();
      setOrders(data.orders || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load seller overview");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const totalOrders = orders.length;

  const activeOrders = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "processing", "shipped", "mixed"].includes(order.sellerSummaryStatus)
    ).length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.sellerSummaryStatus === "delivered").length;
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.sellerSubtotal || 0), 0);
  }, [orders]);

  const pendingShipmentCount = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "processing"].includes(order.sellerSummaryStatus)
    ).length;
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading seller overview...</p>
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <OrderStatCard
          label="Total Orders"
          value={totalOrders}
          hint="Orders received"
        />
        <OrderStatCard
          label="Active"
          value={activeOrders}
          hint="Pending to shipped"
        />
        <OrderStatCard
          label="Delivered"
          value={deliveredOrders}
          hint="Completed items"
        />
        <OrderStatCard
          label="Revenue"
          value={`${totalRevenue.toFixed(2)} $`}
          hint="Subtotal across your orders"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Quick Actions</h2>
          <p className="mt-2 text-sm text-slate-600">
            Jump straight into the main seller workflows.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/seller/products"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <PackageCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Manage Products</p>
                  <p className="text-sm text-slate-500">Update your listings and inventory</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/seller/orders"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">View Orders</p>
                  <p className="text-sm text-slate-500">Track and fulfill customer orders</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/seller/profile"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <UserCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Update Profile</p>
                  <p className="text-sm text-slate-500">Manage your seller details</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Wallet size={16} />
              Revenue Snapshot
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {totalRevenue.toFixed(2)} $
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Based on your current seller order subtotals
            </p>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Recent Orders</h2>
              <p className="mt-2 text-sm text-slate-600">
                Latest order activity for your products
              </p>
            </div>

            <Link
              to="/seller/orders"
              className="text-sm font-medium text-teal-700 transition hover:text-teal-800"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                No seller orders available yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/seller/orders/${order._id}`}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold tracking-tight text-slate-950">
                        {order.sellerOrderRef || order.orderNumber || order._id}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {order.userId?.name || "Customer"} • {order.userId?.email || "-"}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                      <StatusBadge status={order.sellerSummaryStatus} type="order" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm text-slate-500">
                      {order.sellerQuantity || 0} item{Number(order.sellerQuantity || 0) > 1 ? "s" : ""}
                    </span>
                    <span className="text-base font-semibold text-slate-950">
                      {Number(order.sellerSubtotal || 0).toFixed(2)} $
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}