import { useEffect, useMemo, useState } from "react";
import DataTableModule from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  RefreshCw,
  Search,
  Pencil,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  Boxes,
  Warehouse,
} from "lucide-react";
import {
  deleteSellerProductApi,
  getSellerProductsApi,
} from "../../api/productApi";
import { toast } from "sonner";
import OrderStatCard from "../../components/orders/OrderStatCard";

const DataTable = DataTableModule?.default || DataTableModule;

export default function SellerProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getSellerProductsApi();
      const list = data.products || [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const next = products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });

    setFilteredProducts(next);
  }, [searchText, products]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      setError("");

      await deleteSellerProductApi(id);

      setProducts((prev) => prev.filter((item) => item._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete product");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalProducts = products.length;

  const activeProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) > 0).length;
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) <= 0).length;
  }, [products]);

  const totalStock = useMemo(() => {
    return products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  }, [products]);

  const columns = useMemo(
    () => [
      {
        name: "Product",
        sortable: true,
        grow: 2,
        cell: (row) => (
          <div className="py-3">
            <p className="font-semibold tracking-tight text-slate-950">
              {row.name}
            </p>
            <p className="text-xs text-slate-500">
              {row.brand || row.category || "No category"}
            </p>
          </div>
        ),
      },
      {
        name: "Category",
        selector: (row) => row.category || "",
        sortable: true,
        cell: (row) => (
          <span className="text-sm text-slate-700">{row.category || "-"}</span>
        ),
      },
      {
        name: "Price",
        selector: (row) => row.price,
        sortable: true,
        cell: (row) => (
          <span className="text-sm font-semibold text-slate-950">
            {Number(row.price || 0).toFixed(2)} $
          </span>
        ),
      },
      {
        name: "Stock",
        selector: (row) => row.stock,
        sortable: true,
        cell: (row) => {
          const inStock = Number(row.stock || 0) > 0;

          return (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                inStock
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-rose-50 text-rose-700 ring-rose-200"
              }`}
            >
              {inStock ? `${row.stock} in stock` : "Out of stock"}
            </span>
          );
        },
      },
      {
        name: "Actions",
        width: "170px",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/seller/products/${row._id}`);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              title="View product"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/seller/products/${row._id}/edit`);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              title="Edit product"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row._id);
              }}
              disabled={actionLoadingId === row._id}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
              title="Delete product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [actionLoadingId, navigate]
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
        <OrderStatCard label="Total Products" value={totalProducts} hint="All your listings" />
        <OrderStatCard label="Active" value={activeProducts} hint="Currently in stock" />
        <OrderStatCard label="Out of Stock" value={outOfStockProducts} hint="Need restocking" />
        <OrderStatCard label="Total Stock" value={totalStock} hint="All units combined" />
      </div>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Products Table</h2>
            <p className="mt-1 text-sm text-slate-600">
              Click a row to open product details. Edit and delete actions stay on the right.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={fetchProducts}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              to="/seller/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              <Plus size={16} />
              Add Product
            </Link>
          </div>
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
              placeholder="Search by name, category, brand, or description..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total results:{" "}
            <span className="font-semibold text-slate-950">{filteredProducts.length}</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
          <DataTable
            columns={columns}
            data={filteredProducts}
            progressPending={isLoading}
            pagination
            highlightOnHover
            pointerOnHover
            responsive
            persistTableHead
            customStyles={customStyles}
            onRowClicked={(row) => navigate(`/seller/products/${row._id}`)}
            progressComponent={
              <div className="p-6 text-sm text-slate-600">Loading products...</div>
            }
            noDataComponent={
              <div className="p-6 text-sm text-slate-500">No products found.</div>
            }
          />
        </div>
      </section>
    </div>
  );
}