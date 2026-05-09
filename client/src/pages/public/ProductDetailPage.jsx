import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Store,
  Truck,
  ShieldCheck,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { getAllProductsApi, getSingleProductApi } from "../../api/productApi";
import ProductCard from "../../components/products/ProductCard";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import ReviewsSection from "../../components/reviews/ReviewsSection";

function InfoAccordionItem({ title, children, defaultOpen = false }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-slate-200 bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-slate-900">
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </details>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getSingleProductApi(id);
        const fetchedProduct = data.product;

        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct?.images?.[0] || "");
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;

      try {
        setRelatedLoading(true);
        const data = await getAllProductsApi();
        const items = (data.products || []).filter(
          (item) => item._id !== product._id && item.category === product.category
        );
        setRelatedProducts(items.slice(0, 4));
      } catch (error) {
        console.error("Failed to load related products:", error);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  const images = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images;
  }, [product]);

  const increaseQty = () => {
    if (!product?.stock) return;
    setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!product || Number(product.stock || 0) <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product, quantity);
    toast.success("Product added to cart");
  };

  const hasMultipleImages = images.length > 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-4 md:grid-cols-[88px_1fr]">
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
                ))}
              </div>
              <div className="aspect-square animate-pulse rounded-[28px] bg-slate-200" />
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-8 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-6 h-20 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-8 h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
              <div className="mt-4 h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8">
            <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
            <p className="mt-3 text-sm text-rose-700">
              {error || "We could not find the requested product."}
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

  const inStock = Number(product.stock || 0) > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-medium hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
          <span className="text-slate-300">/</span>
          <span>{product.category || "Category"}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[120px_minmax(0,1fr)_0.85fr]">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-1">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    className={`w-full overflow-hidden rounded-[24px] border bg-white p-2 shadow-sm transition ${selectedImage === image
                        ? "border-teal-500 ring-2 ring-teal-100"
                        : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex h-[92px] w-full items-center justify-center overflow-hidden rounded-[18px] bg-slate-100">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </button>
                ))
              ) : (
                <div className="w-full rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm">
                  <div className="flex h-[92px] w-full items-center justify-center rounded-[18px] bg-slate-100 text-xs text-slate-400">
                    No image
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex min-h-[420px] items-center justify-center rounded-[22px] bg-slate-100 p-6 sm:min-h-[520px]">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="max-h-[620px] w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-3 space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
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
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Store size={16} />
                <span>
                  Sold by{" "}
                  <Link
                    to={`/store/${product.sellerId?._id || ""}`}
                    className="font-medium text-teal-700 hover:text-teal-800"
                  >
                    {product.sellerId?.name || "Marketplace Seller"}
                  </Link>
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-y border-slate-100 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Price
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                    {Number(product.price || 0).toFixed(2)} $
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${inStock
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                    }`}
                >
                  {inStock ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 sm:w-auto">
                  <button
                    onClick={decreaseQty}
                    className="inline-flex h-12 w-12 items-center justify-center text-slate-500 transition hover:text-slate-900"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="flex h-12 min-w-[56px] items-center justify-center text-sm font-semibold text-slate-900">
                    {quantity}
                  </div>

                  <button
                    onClick={increaseQty}
                    className="inline-flex h-12 w-12 items-center justify-center text-slate-500 transition hover:text-slate-900"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex h-12 w-full items-center justify-center rounded-2xl bg-teal-600 px-6 text-sm font-semibold text-white transition hover:bg-teal-700 sm:flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <InfoAccordionItem title="Description" defaultOpen>
                {product.description || "No product description available."}
              </InfoAccordionItem>

              <InfoAccordionItem title="Shipping & Returns">
                Delivery timelines, shipping rules, and return details can be shown here
                for a cleaner and more trustworthy product experience.
              </InfoAccordionItem>

              <InfoAccordionItem title="Marketplace Seller">
                Seller identity stays visible so customers always know who they are
                buying from in this multi-vendor marketplace.
              </InfoAccordionItem>

              <InfoAccordionItem title="Purchase Confidence">
                Clear inventory, visible seller info, and a simple checkout flow make
                the product page easier to trust and easier to use.
              </InfoAccordionItem>
            </div>
          </div>
        </div>

        <ReviewsSection product={product} />

        <section className="mt-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
                Related Products
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                More in {product.category}
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Explore similar products from the same marketplace category.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {relatedLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
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
            ) : relatedProducts.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-500">
                  No related products found in this category.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}