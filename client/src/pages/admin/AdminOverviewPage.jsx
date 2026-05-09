import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Users,
  Store,
  Package,
  ReceiptText,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getAllUsersApi } from "../../api/adminApi";
import { getAllOrdersAdminApi } from "../../api/orderApi";
import { getAllProductsApi } from "../../api/productApi";
import OrderStatCard from "../../components/orders/OrderStatCard";
import StatusBadge from "../../components/orders/StatusBadge";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [usersData, ordersData, productsData] = await Promise.all([
        getAllUsersApi(),
        getAllOrdersAdminApi(),
        getAllProductsApi(),
      ]);

      setUsers(usersData.users || []);
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load admin overview");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const totalUsers = users.length;

  const totalSellers = useMemo(() => {
    return users.filter((user) => user.role === "seller").length;
  }, [users]);

  const totalCustomers = useMemo(() => {
    return users.filter((user) => user.role === "customer").length;
  }, [users]);

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const pendingOrders = useMemo(() => {
    return orders.filter((order) =>
      ["pending", "processing", "mixed"].includes(order.overallStatus)
    ).length;
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.overallStatus === "delivered").length;
  }, [orders]);

  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  const activeProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) > 0).length;
  }, [products]);

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading admin overview...</p>
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
          label="Total Users"
          value={totalUsers}
          hint="All registered accounts"
        />
        <OrderStatCard
          label="Sellers"
          value={totalSellers}
          hint="Approved seller accounts"
        />
        <OrderStatCard
          label="Orders"
          value={totalOrders}
          hint="All marketplace orders"
        />
        <OrderStatCard
          label="Sales"
          value={`${totalSales.toFixed(2)} $`}
          hint="Gross order value"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Quick Admin Actions</h2>
          <p className="mt-2 text-sm text-slate-600">
            Jump into the main marketplace management areas.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Users size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Manage Users</p>
                  <p className="text-sm text-slate-500">View customers and sellers</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/admin/sellers"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Store size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Manage Sellers</p>
                  <p className="text-sm text-slate-500">Review seller-side activity</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/admin/products"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Package size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Manage Products</p>
                  <p className="text-sm text-slate-500">Monitor marketplace catalog</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <ReceiptText size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Monitor Orders</p>
                  <p className="text-sm text-slate-500">Read-only marketplace visibility</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Users size={16} />
                Customers
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {totalCustomers}
              </p>
              <p className="mt-1 text-sm text-slate-500">buyer accounts</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Package size={16} />
                Active Products
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {activeProducts}
              </p>
              <p className="mt-1 text-sm text-slate-500">currently in stock</p>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Recent Orders</h2>
              <p className="mt-2 text-sm text-slate-600">
                Latest marketplace order activity
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-medium text-teal-700 transition hover:text-teal-800"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">
                No marketplace orders available yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold tracking-tight text-slate-950">
                        {order.orderNumber || order._id}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {order.userId?.name || "Customer"} • {order.userId?.email || "-"}
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
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}