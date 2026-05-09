import { useEffect, useMemo, useState } from "react";
import DataTableModule from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Search,
  Sparkles,
  PackageCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { getSellerOrdersApi } from "../../api/orderApi";
import StatusBadge from "../../components/orders/StatusBadge";
import OrderStatCard from "../../components/orders/OrderStatCard";

const DataTable = DataTableModule?.default || DataTableModule;

export default function SellerOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellerOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getSellerOrdersApi();
      const list = data.orders || [];
      setOrders(list);
      setFilteredOrders(list);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load seller orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  useEffect(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      setFilteredOrders(orders);
      return;
    }

    const next = orders.filter((order) => {
      return (
        order.orderNumber?.toLowerCase().includes(query) ||
        order.sellerOrderRef?.toLowerCase().includes(query) ||
        order.userId?.name?.toLowerCase().includes(query) ||
        order.userId?.email?.toLowerCase().includes(query) ||
        order.paymentStatus?.toLowerCase().includes(query) ||
        order.sellerSummaryStatus?.toLowerCase().includes(query)
      );
    });

    setFilteredOrders(next);
  }, [searchText, orders]);

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

  const columns = useMemo(
    () => [
      {
        name: "Order",
        sortable: true,
        grow: 1.8,
        cell: (row) => (
          <div className="py-3">
            <p className="font-semibold tracking-tight text-slate-950">
              {row.sellerOrderRef || row.orderNumber || row._id}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(row.createdAt).toLocaleDateString()}
            </p>
          </div>
        ),
      },
      {
        name: "Customer",
        sortable: true,
        grow: 1.7,
        cell: (row) => (
          <div className="py-3">
            <p className="font-semibold text-slate-950">{row.userId?.name || "-"}</p>
            <p className="text-xs text-slate-500">{row.userId?.email || "-"}</p>
          </div>
        ),
      },
      {
        name: "Items",
        selector: (row) => row.sellerQuantity,
        sortable: true,
        cell: (row) => (
          <span className="text-sm font-medium text-slate-700">
            {row.sellerQuantity}
          </span>
        ),
      },
      {
        name: "Subtotal",
        selector: (row) => row.sellerSubtotal,
        sortable: true,
        cell: (row) => (
          <span className="text-sm font-semibold text-slate-950">
            {Number(row.sellerSubtotal || 0).toFixed(2)} $
          </span>
        ),
      },
      {
        name: "Payment",
        cell: (row) => (
          <StatusBadge status={row.paymentStatus} type="payment" />
        ),
      },
      {
        name: "Your Status",
        cell: (row) => (
          <StatusBadge status={row.sellerSummaryStatus} type="order" />
        ),
      },
    ],
    []
  );

  const customStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        minHeight: "58px",
        borderBottomWidth: "1px",
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
      },
    },
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: 700,
        color: "#475569",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        minHeight: "78px",
        borderBottomWidth: "1px",
        borderBottomColor: "#f1f5f9",
        backgroundColor: "#ffffff",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f8fafc",
        transition: "background-color 0.15s ease-in-out",
        cursor: "pointer",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    pagination: {
      style: {
        borderTopWidth: "1px",
        borderTopColor: "#e2e8f0",
        minHeight: "64px",
        backgroundColor: "#ffffff",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <OrderStatCard label="Total Orders" value={totalOrders} hint="Orders received" />
        <OrderStatCard label="Active" value={activeOrders} hint="Pending to shipped" />
        <OrderStatCard label="Delivered" value={deliveredOrders} hint="Completed items" />
        <OrderStatCard
          label="Revenue"
          value={`${totalRevenue.toFixed(2)} $`}
          hint="Subtotal across your orders"
        />
      </div>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Order Table</h2>
            <p className="mt-1 text-sm text-slate-600">
              Click any row to view full order details and update item statuses.
            </p>
          </div>

          <button
            onClick={fetchSellerOrders}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search order, customer, email, or status..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total results:{" "}
            <span className="font-semibold text-slate-950">{filteredOrders.length}</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <DataTable
            columns={columns}
            data={filteredOrders}
            progressPending={isLoading}
            pagination
            highlightOnHover
            pointerOnHover
            responsive
            persistTableHead
            customStyles={customStyles}
            onRowClicked={(row) => navigate(`/seller/orders/${row._id}`)}
            progressComponent={
              <div className="p-6 text-sm text-slate-600">Loading seller orders...</div>
            }
            noDataComponent={
              <div className="p-6 text-sm text-slate-500">No orders found.</div>
            }
          />
        </div>
      </section>
    </div>
  );
}