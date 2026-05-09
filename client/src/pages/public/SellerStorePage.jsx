import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Search,
  Shapes,
  Store,
  Warehouse,
} from "lucide-react";
import { getPublicSellerStoreApi } from "../../api/sellerApi";
import ProductCard from "../../components/products/ProductCard";

export default function SellerStorePage() {
  const { sellerId } = useParams();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalCategories: 0,
  });

  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellerStore = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getPublicSellerStoreApi(sellerId);

      setSeller(data.seller || null);
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setStats(
        data.stats || {
          totalProducts: 0,
          totalStock: 0,
          totalCategories: 0,
        }
      );
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load seller store");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerStore();
  }, [sellerId]);

  const filteredProducts = useMemo(() => {
    let items = [...products];
    const query = searchText.trim().toLowerCase();

    if (query) {
      items = items.filter((item) => {
        return (
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      });
    }

    if (activeCategory) {
      items = items.filter((item) => item.category === activeCategory);
    }

    return items;
  }, [products, searchText, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-10 w-80 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
                <div className="mt-4 h-4 w-20 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-5 h-12 animate-pulse rounded-2xl bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
            <h1 className="text-2xl font-bold text-slate-900">Seller store not found</h1>
            <p className="mt-3 text-sm text-red-700">
              {error || "We could not load this seller store."}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-teal-200">
                <Store size={14} />
                Seller Store
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                {seller.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Browse products listed by this seller through a clean, dedicated storefront experience.
              </p>

              <p className="mt-3 text-sm text-slate-500">
                Seller since{" "}
                <span className="font-medium text-slate-900">
                  {seller.createdAt
                    ? new Date(seller.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">Store Contact</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {seller.email || "Not available"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Package size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Products</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Shapes size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Categories</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {stats.totalCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Warehouse size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Stock Units</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {stats.totalStock}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search this seller's products..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
              />
            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-teal-500 focus:bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-teal-700">Store Products</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Products from {seller.name}
              </h2>
            </div>

            <div className="text-sm text-slate-500">
              Results:{" "}
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">
                No products found
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Try changing your search or category filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}