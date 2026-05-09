import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  ImageIcon,
  Pencil,
  Store,
  Tag,
} from "lucide-react";
import { getSellerProductsApi } from "../../api/productApi";

export default function SellerProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getSellerProductsApi();
      const foundProduct = (data.products || []).find((item) => item._id === id);

      if (!foundProduct) {
        setError("Product not found");
        setProduct(null);
        return;
      }

      setProduct(foundProduct);
      setSelectedImage(foundProduct?.images?.[0] || "");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const images = useMemo(() => {
    return product?.images || [];
  }, [product]);

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-[30px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Product not found"}
      </div>
    );
  }

  const inStock = Number(product.stock || 0) > 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_30%)]" />

        <div className="relative px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Seller Product Detail</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                View your product information, images, stock, and pricing from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/seller/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Back to Products
              </Link>

              <Link
                to={`/seller/products/${product._id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <Pencil size={16} />
                Edit Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[24px] bg-slate-100 p-6">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="max-h-[620px] w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <ImageIcon size={28} />
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>

          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-2xl border bg-white p-1.5 shadow-sm transition ${
                    selectedImage === image
                      ? "border-teal-500 ring-2 ring-teal-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {product.category ? (
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
                  {product.category}
                </span>
              ) : null}

              {product.brand ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                  {product.brand}
                </span>
              ) : null}

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                  inStock
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-rose-200"
                }`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Tag size={16} />
                  Price
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {Number(product.price || 0).toFixed(2)} $
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Boxes size={16} />
                  Stock
                </div>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {Number(product.stock || 0)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Store size={16} />
                Product Description
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {product.description || "No description available."}
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <BadgeCheck size={16} />
              Product Summary
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Name:</span> {product.name}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Category:</span>{" "}
                {product.category || "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Brand:</span>{" "}
                {product.brand || "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Status:</span>{" "}
                {inStock ? "Available" : "Out of stock"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}