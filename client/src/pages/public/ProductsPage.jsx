import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  PackageSearch,
  DollarSign,
} from "lucide-react";
import { getAllProductsApi } from "../../api/productApi";
import ProductCard from "../../components/products/ProductCard";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [stockFilter, setStockFilter] = useState(
    searchParams.get("inStock") === "true" ? "in-stock" : "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const buildParams = () => {
    return {
      search: searchInput.trim(),
      category: activeCategory,
      minPrice,
      maxPrice,
      sort: sortBy,
      inStock: stockFilter === "in-stock" ? "true" : "",
    };
  };

  const syncUrlParams = () => {
    const nextParams = new URLSearchParams();

    if (searchInput.trim()) nextParams.set("search", searchInput.trim());
    if (activeCategory) nextParams.set("category", activeCategory);
    if (minPrice !== "") nextParams.set("minPrice", minPrice);
    if (maxPrice !== "") nextParams.set("maxPrice", maxPrice);
    if (sortBy !== "newest") nextParams.set("sort", sortBy);
    if (stockFilter === "in-stock") nextParams.set("inStock", "true");

    setSearchParams(nextParams, { replace: true });
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAllProductsApi(buildParams());
      setProducts(data.products || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const data = await getAllProductsApi();
      const categories = [...new Set((data.products || []).map((item) => item.category).filter(Boolean))].sort();
      setAllCategories(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    syncUrlParams();
    fetchProducts();
  }, [searchInput, activeCategory, minPrice, maxPrice, stockFilter, sortBy]);

  const activeFilters = useMemo(() => {
    const filters = [];

    if (searchInput.trim()) {
      filters.push({
        key: "search",
        label: `Search: ${searchInput.trim()}`,
      });
    }

    if (activeCategory) {
      filters.push({
        key: "category",
        label: `Category: ${activeCategory}`,
      });
    }

    if (minPrice !== "") {
      filters.push({
        key: "minPrice",
        label: `Min: $${minPrice}`,
      });
    }

    if (maxPrice !== "") {
      filters.push({
        key: "maxPrice",
        label: `Max: $${maxPrice}`,
      });
    }

    if (stockFilter !== "all") {
      filters.push({
        key: "stock",
        label: "In Stock Only",
      });
    }

    if (sortBy !== "newest") {
      const sortLabelMap = {
        price_asc: "Price Low to High",
        price_desc: "Price High to Low",
        rating_desc: "Highest Rated",
      };

      filters.push({
        key: "sort",
        label: `Sort: ${sortLabelMap[sortBy] || sortBy}`,
      });
    }

    return filters;
  }, [searchInput, activeCategory, minPrice, maxPrice, stockFilter, sortBy]);

  const handleReset = () => {
    setSearchInput("");
    setActiveCategory("");
    setMinPrice("");
    setMaxPrice("");
    setStockFilter("all");
    setSortBy("newest");
  };

  const removeFilter = (key) => {
    if (key === "search") setSearchInput("");
    if (key === "category") setActiveCategory("");
    if (key === "minPrice") setMinPrice("");
    if (key === "maxPrice") setMaxPrice("");
    if (key === "stock") setStockFilter("all");
    if (key === "sort") setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="grid gap-4 xl:grid-cols-[1.25fr_220px_150px_150px_200px_130px]">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none focus:border-teal-500 focus:bg-white"
                >
                  <option value="">All Categories</option>
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <DollarSign
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  value={minPrice}
                  min="0"
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min Price"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="relative">
                <DollarSign
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  value={maxPrice}
                  min="0"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max Price"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-teal-500 focus:bg-white"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
              </select>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <RefreshCw size={16} />
                Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 border-t border-slate-100 pt-1">
              <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={stockFilter === "in-stock"}
                  onChange={(e) =>
                    setStockFilter(e.target.checked ? "in-stock" : "all")
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Show in-stock products only
              </label>
            </div>

            {activeFilters.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-1">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => removeFilter(filter.key)}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {filter.label}
                    <span className="ml-2 text-slate-400">×</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-8">
          {error ? (
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
              {error}
            </div>
          ) : isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="aspect-square animate-pulse rounded-[22px] bg-slate-200" />
                  <div className="mt-4 h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="mt-5 h-12 animate-pulse rounded-2xl bg-slate-200" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <PackageSearch size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-slate-900">
                No products found
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Try a different search term or clear your current filters.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-6 inline-flex rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {products.length}
                  </span>{" "}
                  products
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}