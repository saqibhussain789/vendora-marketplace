import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProductsApi } from "../api/productApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (searchValue = "") => {
    try {
      setIsLoading(true);
      const data = await getAllProductsApi({ search: searchValue });
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="mt-2 text-slate-500">Browse marketplace products</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-teal-500"
          />
          <button className="rounded-xl bg-teal-600 px-5 text-white font-medium hover:bg-teal-700">
            Search
          </button>
        </form>

        {isLoading ? (
          <p className="text-slate-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-slate-600">No products found.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-slate-500">{product.category}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {product.price}$
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}