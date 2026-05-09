import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedCategories({
  categories = [],
  isLoading = false,
  error = "",
}) {
  return (
    <section className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
              Shop by Category
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Explore categories that match your space
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Browse curated product categories from active marketplace sellers.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Browse all
            <ArrowRight size={16} />
          </Link>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[5/4] animate-pulse bg-slate-200" />
                <div className="p-5">
                  <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="mt-6 h-4 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
              No categories found
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Categories will appear here once active products are available.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-slate-100">
                  {category.sampleImage ? (
                    <img
                      src={category.sampleImage}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#e2e8f0,#f8fafc)]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-950/5 to-transparent opacity-80" />

                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-700 backdrop-blur">
                      {category.totalProducts} products
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {category.totalStock} stock units available
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-medium text-slate-700 transition group-hover:text-slate-950">
                      View Category
                    </span>

                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-teal-600 group-hover:text-white">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}