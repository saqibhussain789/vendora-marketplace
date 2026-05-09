import { ShieldCheck, CreditCard, Truck } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-teal-300">Why Buyers Choose Us</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Designed for trust, clarity, and smooth buying
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            A multi-seller marketplace works best when buyers feel confident at every step.
            This experience is built to make browsing, comparing, and buying feel simple.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-300">
              <ShieldCheck size={20} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Verified Seller Visibility</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Customers always know who is selling the product and where it comes from.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-300">
              <CreditCard size={20} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Clear Checkout Flow</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A friction-free checkout experience helps buyers move confidently toward purchase.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-300">
              <Truck size={20} />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Delivery Confidence</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Shipping, returns, and seller trust cues should feel visible and reassuring.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}