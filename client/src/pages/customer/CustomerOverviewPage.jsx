import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ShoppingCart,
  PackageCheck,
  Truck,
  ArrowRight,
  MapPinHouse,
  UserCircle2,
  ReceiptText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyOrdersApi } from "../../api/orderApi";
import OrderStatCard from "../../components/orders/OrderStatCard";
import StatusBadge from "../../components/orders/StatusBadge";

export default function CustomerOverviewPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getMyOrdersApi();
      setOrders(data.orders || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load customer overview");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const activeOrders = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "processing", "shipped", "mixed"].includes(order.overallStatus)
    ).length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.overallStatus === "delivered").length;
  }, [orders]);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  const defaultAddress = useMemo(() => {
    return user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0] || null;
  }, [user]);

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading your dashboard...</p>
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
          hint="All your purchases"
        />
        <OrderStatCard
          label="Active Orders"
          value={activeOrders}
          hint="Pending to shipped"
        />
        <OrderStatCard
          label="Delivered"
          value={deliveredOrders}
          hint="Completed orders"
        />
        <OrderStatCard
          label="Total Spent"
          value={`${totalSpent.toFixed(2)} $`}
          hint="Across all orders"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Quick Actions</h2>
          <p className="mt-2 text-sm text-slate-600">
            Jump straight into the main account workflows.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/products"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Continue Shopping</p>
                  <p className="text-sm text-slate-500">Browse more marketplace products</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/dashboard/orders"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <ReceiptText size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">View Orders</p>
                  <p className="text-sm text-slate-500">Track your purchase history</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/dashboard/profile"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <UserCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Update Profile</p>
                  <p className="text-sm text-slate-500">Manage your account details</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/dashboard/addresses"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <MapPinHouse size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Manage Addresses</p>
                  <p className="text-sm text-slate-500">Update your shipping details</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <MapPinHouse size={16} />
              Default Address
            </div>

            {defaultAddress ? (
              <div className="mt-3 text-sm leading-7 text-slate-600">
                <p className="font-medium text-slate-950">
                  {defaultAddress.fullName || user?.name || "-"}
                </p>
                <p>{defaultAddress.street || "-"}</p>
                <p>
                  {defaultAddress.city || "-"}, {defaultAddress.state || "-"}{" "}
                  {defaultAddress.postalCode || "-"}
                </p>
                <p>{defaultAddress.country || "-"}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No saved address found yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Recent Orders</h2>
              <p className="mt-2 text-sm text-slate-600">
                Your latest order activity
              </p>
            </div>

            <Link
              to="/dashboard/orders"
              className="text-sm font-medium text-teal-700 transition hover:text-teal-800"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                No orders available yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to="/dashboard/orders"
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold tracking-tight text-slate-950">
                        {order.orderNumber || order._id}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Seller: {order.sellerName || "Marketplace Seller"}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={order.paymentStatus} type="payment" />
                      <StatusBadge status={order.overallStatus} type="order" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm text-slate-500">
                      {order.items?.length || 0} item{Number(order.items?.length || 0) > 1 ? "s" : ""}
                    </span>
                    <span className="text-base font-semibold text-slate-950">
                      {Number(order.totalPrice || 0).toFixed(2)} $
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