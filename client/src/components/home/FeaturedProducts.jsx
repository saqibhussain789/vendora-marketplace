import { ArrowRight, ArrowUpRight, Package, Star, Store, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const getPrimaryImage = (product) => {
  if (product?.images?.length) {
    const firstImage = product.images[0];
    return firstImage?.url || firstImage;
  }
  return "";
};

const formatPrice = (price) => `${Number(price || 0).toFixed(2)}$`;

function RatingRow({ product }) {
  const rating = Number(product?.ratings || 0);
  const reviewCount = Number(product?.numReviews || 0);

  if (!reviewCount) {
    return <p className="text-xs text-slate-400">No reviews yet</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={13}
            className={index < Math.round(rating) ? "fill-current" : ""}
          />
        ))}
      </div>

      <span className="text-xs font-medium text-slate-200">
        {rating.toFixed(1)}
      </span>

      <span className="text-xs text-slate-400">
        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}

function FeaturedProductMiniCard({ product }) {
  const image = getPrimaryImage(product);
  const inStock = Number(product?.stock || 0) > 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(2,6,23,0.25)] transition duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:bg-white/[0.06]"
    >
      <div className="relative h-[220px] overflow-hidden bg-slate-900">
        {image ? (
          <img
            src={image}
            alt={product?.name || "Product image"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            <Package size={28} />
          </div>
        )}

        <div className="absolute left-3 top-3 flex w-[calc(100%-24px)] items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur">
            <Tag size={11} />
            {product?.category || "Product"}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-[10px] font-medium ${
              inStock
                ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border border-rose-400/30 bg-rose-400/10 text-rose-300"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Store size={13} />
          <span className="truncate">{product?.sellerId?.name || "Trusted seller"}</span>
        </div>

        <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-white">
          {product?.name}
        </h3>

        <div className="mt-2">
          <RatingRow product={product} />
        </div>

        {/* <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
          {product?.description || "Explore this featured product from our marketplace."}
        </p> */}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Price
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {formatPrice(product?.price)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              Stock
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {product?.stock ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-200 transition group-hover:border-teal-400/30 group-hover:text-white">
          <span>View Details</span>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04]">
      <div className="h-[220px] animate-pulse bg-white/5" />
      <div className="p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-white/10" />
        <div className="mt-5 h-12 w-full animate-pulse rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

export default function FeaturedProducts({
  products = [],
  isLoading = false,
  error = "",
}) {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_26%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Featured Products
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Popular picks across the marketplace
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Explore active products from trusted sellers in a cleaner, more compact featured layout.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-teal-400/30 hover:bg-white/[0.08] hover:text-white"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        ) : isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="mt-10 rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-16 text-center backdrop-blur">
            <h3 className="text-2xl font-semibold text-white">
              No featured products found
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Featured products will appear here once inventory becomes active.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <FeaturedProductMiniCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}