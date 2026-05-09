import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage  from "../../assets/images/Hero.png";

export default function HeroSection({ summary = {}, isLoading = false }) {
  const totalProducts = summary?.totalProducts || 0;
  const totalSellers = summary?.totalSellers || 0;
  const totalCategories = summary?.totalCategories || 0;

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_35%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="absolute left-[-120px] top-[120px] h-[260px] w-[260px] rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute right-[-80px] top-[160px] h-[240px] w-[240px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-[-120px] left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm font-medium text-teal-300 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <Sparkles size={16} />
            Multi-vendor marketplace
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Discover premium products from{" "}
            <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              trusted sellers
            </span>{" "}
            in one place
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
            A modern ecommerce marketplace where multiple sellers list products
            and customers shop through one fast, polished experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700"
            >
              Explore Products
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:bg-white/[0.06]"
            >
              Become a Seller
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure checkout flow
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              Multi-seller storefronts
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Clean buyer experience
            </span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                {isLoading ? "..." : `${totalProducts}+`}
              </p>
              <p className="mt-1 text-sm text-slate-400">Listed Products</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                {isLoading ? "..." : `${totalSellers}+`}
              </p>
              <p className="mt-1 text-sm text-slate-400">Active Sellers</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                {isLoading ? "..." : `${totalCategories}+`}
              </p>
              <p className="mt-1 text-sm text-slate-400">Categories</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative flex w-full max-w-[640px] items-center justify-center">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-teal-500/15 blur-3xl" />
            <div className="absolute h-[320px] w-[320px] rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-[2px]" />

            <div className="relative w-full">
              <img
                src={heroImage}
                alt="Marketplace hero visual"
                className="relative z-10 mx-auto max-h-[520px] w-full object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}