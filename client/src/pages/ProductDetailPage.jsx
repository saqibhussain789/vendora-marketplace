import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleProductApi } from "../api/productApi";

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getSingleProductApi(id);
        setProduct(data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 p-10">Loading product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-slate-50 p-10">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-slate-900">{product.price}$</p>
          <p className="mt-4 text-slate-600">{product.description}</p>
          <p className="mt-4 text-sm text-slate-500">Stock: {product.stock}</p>
          <p className="mt-2 text-sm text-slate-500">
            Seller: {product.sellerId?.name || "Unknown"}
          </p>

          <button className="mt-6 rounded-xl bg-teal-600 px-5 py-3 text-white font-medium hover:bg-teal-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}