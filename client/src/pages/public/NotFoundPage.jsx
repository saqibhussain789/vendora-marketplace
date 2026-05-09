import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-sm font-medium text-teal-300">
              <Sparkles size={15} />
              404 Error
            </div>

            <h1 className="mt-6 text-6xl font-bold tracking-tight text-white sm:text-7xl">
              Page not found
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              The page you are looking for does not exist, may have been moved,
              or is no longer available in this marketplace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                <Home size={16} />
                Go back home
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                <Search size={16} />
                Browse products
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle,rgba(20,184,166,0.16),transparent_60%)]" />
            <div className="relative rounded-[36px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
              <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-8">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Broken route
                </p>
                <p className="mt-4 text-[120px] font-bold leading-none text-white sm:text-[160px]">
                  404
                </p>
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 text-sm text-slate-400">
                  The requested route could not be found. Use the buttons on the left to return to a valid page.
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    <span className="font-medium text-white">Tip:</span> Try the homepage for featured collections and sellers.
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    <span className="font-medium text-white">Tip:</span> Use products page to continue browsing without losing momentum.
                  </div>
                </div>
              </div>

              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-300 transition hover:text-teal-200"
              >
                <ArrowLeft size={16} />
                Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}