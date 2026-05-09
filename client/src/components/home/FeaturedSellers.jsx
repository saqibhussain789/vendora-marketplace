import { Link } from "react-router-dom";

export default function FeaturedSellers({
  sellers = [],
  isLoading = false,
  error = "",
}) {
  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const rowOne = sellers.length > 0 ? [...sellers, ...sellers, ...sellers] : [];
  const rowTwo =
    sellers.length > 0
      ? [...sellers].reverse().concat([...sellers].reverse(), [...sellers].reverse())
      : [];

  const SellerAvatar = ({ seller, variant = "top" }) => {
    const gradientClass =
      variant === "top"
        ? "bg-[linear-gradient(135deg,#f8fafc,#eef2ff)]"
        : "bg-[linear-gradient(135deg,#f8fafc,#ecfeff)]";

    return (
      <div
        className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 ${gradientClass} text-sm font-semibold tracking-wide text-slate-800`}
      >
        {seller?.avatar ? (
          <img
            src={seller.avatar}
            alt={seller.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(seller.name)}</span>
        )}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900">
      <style>
        {`
          @keyframes marquee-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.3333%);
            }
          }

          @keyframes marquee-right {
            0% {
              transform: translateX(-33.3333%);
            }
            100% {
              transform: translateX(0);
            }
          }

          .seller-marquee-left {
            width: max-content;
            animation: marquee-left 30s linear infinite;
            will-change: transform;
          }

          .seller-marquee-right {
            width: max-content;
            animation: marquee-right 34s linear infinite;
            will-change: transform;
          }

          .seller-marquee-wrap:hover .seller-marquee-left,
          .seller-marquee-wrap:hover .seller-marquee-right {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-600">
            Featured Sellers
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Trusted stores across the marketplace
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Discover active seller brands and storefronts growing inside the marketplace.
          </p>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : isLoading ? (
          <div className="mt-12 space-y-5">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex min-w-[240px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex min-w-[240px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
                  >
                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : sellers.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <h3 className="text-2xl font-semibold text-slate-900">
              No featured sellers available
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Featured seller brands will appear here once storefronts are active.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-5">
            <div className="seller-marquee-wrap relative overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

              <div className="overflow-hidden">
                <div className="seller-marquee-left flex items-center gap-4">
                  {rowOne.map((seller, index) => (
                    <Link
                      key={`${seller._id}-top-${index}`}
                      to={`/store/${seller._id}`}
                      className="group flex min-w-[250px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    >
                      <SellerAvatar seller={seller} variant="top" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {seller.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {seller.totalProducts || 0} products
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="seller-marquee-wrap relative overflow-hidden rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

              <div className="overflow-hidden">
                <div className="seller-marquee-right flex items-center gap-4">
                  {rowTwo.map((seller, index) => (
                    <Link
                      key={`${seller._id}-bottom-${index}`}
                      to={`/store/${seller._id}`}
                      className="group flex min-w-[250px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    >
                      <SellerAvatar seller={seller} variant="bottom" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {seller.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {seller.totalCategories || 0} categories
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 text-center">
              <Link
                to="/products"
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
              >
                Explore marketplace products
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}