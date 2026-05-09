import { Link } from "react-router-dom";
import { ArrowUpRight, Store, Tag } from "lucide-react";
import StarRating from "../reviews/StarRating";

export default function ProductCard({ product }) {
  const firstImage = product?.images?.[0];
  const sellerName = product?.sellerId?.name || product?.sellerName || "Marketplace Seller";
  const inStock = Number(product?.stock || 0) > 0;
  const price = Number(product?.price || 0).toFixed(2);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block h-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
    >
      <div className="relative aspect-[1/1] overflow-hidden bg-slate-100">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product?.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#e2e8f0,#f8fafc)] text-sm text-slate-400">
            No image available
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/12 to-transparent" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/92 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur">
          <Tag size={12} />
          {product?.category || "Category"}
        </div>

        <div className="absolute right-4 top-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium shadow-sm ring-1 backdrop-blur ${inStock
                ? "border border-emerald-200 bg-emerald-50/95 text-emerald-700"
                : "border border-rose-200 bg-rose-50/95 text-rose-700"
              }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className="flex h-[calc(100%-theme(space.0))] flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Store size={14} />
          <span className="truncate">{sellerName}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-[1.05rem] font-semibold leading-7 tracking-tight text-slate-950 transition group-hover:text-slate-800">
          {product?.name}
        </h3>

        <div className="mt-3">
          {Number(product.numReviews || 0) > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <StarRating value={Math.round(product.ratings || 0)} size={15} />
              <span className="text-sm font-medium text-slate-700">
                {Number(product.ratings || 0).toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">
                ({product.numReviews} review{product.numReviews !== 1 ? "s" : ""})
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No reviews yet</p>
          )}
        </div>

        <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-600">
          {product?.description || "No description available."}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Price
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {price}$
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Available
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {Number(product?.stock || 0)}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition duration-300 group-hover:border-teal-600 group-hover:bg-teal-600 group-hover:text-white">
            <span className="text-sm font-medium">View Details</span>
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}