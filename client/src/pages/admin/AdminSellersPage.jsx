import { useEffect, useMemo, useState } from "react";
import DataTableModule from "react-data-table-component";
import {
  RefreshCw,
  Search,
  Sparkles,
  Store,
  Package,
  Boxes,
  UserRound,
} from "lucide-react";
import { getAllUsersApi } from "../../api/adminApi";
import { getAllProductsApi } from "../../api/productApi";
import OrderStatCard from "../../components/orders/OrderStatCard";

const DataTable = DataTableModule?.default || DataTableModule;

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellers = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [usersData, productsData] = await Promise.all([
        getAllUsersApi(),
        getAllProductsApi(),
      ]);

      const allUsers = usersData.users || [];
      const allProducts = productsData.products || [];
      const sellerUsers = allUsers.filter((user) => user.role === "seller");

      setSellers(sellerUsers);
      setFilteredSellers(sellerUsers);
      setProducts(allProducts);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load sellers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      setFilteredSellers(sellers);
      return;
    }

    const next = sellers.filter((seller) => {
      return (
        seller.name?.toLowerCase().includes(query) ||
        seller.email?.toLowerCase().includes(query) ||
        seller.phone?.toLowerCase().includes(query)
      );
    });

    setFilteredSellers(next);
  }, [searchText, sellers]);

  const sellerProductMap = useMemo(() => {
    const map = {};

    products.forEach((product) => {
      const sellerId =
        product?.sellerId?._id || product?.sellerId || product?.seller || "";

      if (!sellerId) return;

      if (!map[sellerId]) {
        map[sellerId] = {
          totalProducts: 0,
          stockUnits: 0,
          activeProducts: 0,
        };
      }

      map[sellerId].totalProducts += 1;
      map[sellerId].stockUnits += Number(product.stock || 0);

      if (Number(product.stock || 0) > 0) {
        map[sellerId].activeProducts += 1;
      }
    });

    return map;
  }, [products]);

  const totalSellers = sellers.length;

  const activeSellers = useMemo(() => {
    return sellers.filter((seller) => {
      const stats = sellerProductMap[seller._id];
      return Number(stats?.totalProducts || 0) > 0;
    }).length;
  }, [sellers, sellerProductMap]);

  const totalListings = useMemo(() => {
    return sellers.reduce((sum, seller) => {
      const stats = sellerProductMap[seller._id];
      return sum + Number(stats?.totalProducts || 0);
    }, 0);
  }, [sellers, sellerProductMap]);

  const totalStockUnits = useMemo(() => {
    return sellers.reduce((sum, seller) => {
      const stats = sellerProductMap[seller._id];
      return sum + Number(stats?.stockUnits || 0);
    }, 0);
  }, [sellers, sellerProductMap]);

  const getSellerStatusClasses = (sellerId) => {
    const totalProducts = Number(sellerProductMap[sellerId]?.totalProducts || 0);

    if (totalProducts > 0) {
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    return "bg-amber-50 text-amber-700 ring-amber-200";
  };

  const getSellerStatusText = (sellerId) => {
    const totalProducts = Number(sellerProductMap[sellerId]?.totalProducts || 0);
    return totalProducts > 0 ? "Active" : "No Listings";
  };

  const columns = useMemo(
    () => [
      {
        name: "Seller",
        sortable: true,
        grow: 1.8,
        cell: (row) => (
          <div className="py-3">
            <p className="font-semibold tracking-tight text-slate-950">
              {row.name || "-"}
            </p>
            <p className="text-xs text-slate-500">{row.email || "-"}</p>
          </div>
        ),
      },
      {
        name: "Phone",
        sortable: true,
        grow: 1.2,
        cell: (row) => (
          <span className="text-sm text-slate-700">{row.phone || "-"}</span>
        ),
      },
      {
        name: "Listings",
        sortable: true,
        selector: (row) => Number(sellerProductMap[row._id]?.totalProducts || 0),
        cell: (row) => (
          <span className="text-sm font-semibold text-slate-950">
            {Number(sellerProductMap[row._id]?.totalProducts || 0)}
          </span>
        ),
      },
      {
        name: "Stock Units",
        sortable: true,
        selector: (row) => Number(sellerProductMap[row._id]?.stockUnits || 0),
        cell: (row) => (
          <span className="text-sm text-slate-700">
            {Number(sellerProductMap[row._id]?.stockUnits || 0)}
          </span>
        ),
      },
      {
        name: "Status",
        sortable: true,
        selector: (row) => getSellerStatusText(row._id),
        cell: (row) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${getSellerStatusClasses(
              row._id
            )}`}
          >
            {getSellerStatusText(row._id)}
          </span>
        ),
      },
      {
        name: "Joined",
        sortable: true,
        selector: (row) => row.createdAt,
        cell: (row) => (
          <span className="text-sm text-slate-700">
            {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
          </span>
        ),
      },
    ],
    [sellerProductMap]
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
        <OrderStatCard
          label="Total Sellers"
          value={totalSellers}
          hint="All seller accounts"
        />
        <OrderStatCard
          label="Active Sellers"
          value={activeSellers}
          hint="Have at least one listing"
        />
        <OrderStatCard
          label="Total Listings"
          value={totalListings}
          hint="Products listed by sellers"
        />
        <OrderStatCard
          label="Stock Units"
          value={totalStockUnits}
          hint="Combined seller inventory"
        />
      </div>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Sellers Table</h2>
            <p className="mt-1 text-sm text-slate-600">
              Search seller accounts and review listing activity across the marketplace.
            </p>
          </div>

          <button
            onClick={fetchSellers}
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
              placeholder="Search by seller name, email, or phone..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total results:{" "}
            <span className="font-semibold text-slate-950">{filteredSellers.length}</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <DataTable
            columns={columns}
            data={filteredSellers}
            progressPending={isLoading}
            pagination
            highlightOnHover
            responsive
            persistTableHead
            customStyles={customStyles}
            progressComponent={
              <div className="p-6 text-sm text-slate-600">Loading sellers...</div>
            }
            noDataComponent={
              <div className="p-6 text-sm text-slate-500">No sellers found.</div>
            }
          />
        </div>
      </section>
    </div>
  );
}