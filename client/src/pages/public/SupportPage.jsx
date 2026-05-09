import { Link } from "react-router-dom";
import {
  LifeBuoy,
  ChevronRight,
  ShieldCheck,
  Truck,
  Store,
  FileText,
  Sparkles,
} from "lucide-react";

const supportLinks = [
  {
    title: "Help Center",
    description: "Find quick answers about accounts, orders, checkout, and product browsing.",
    to: "/support/help-center",
    icon: LifeBuoy,
  },
  {
    title: "Shipping & Returns",
    description: "Read how seller-wise shipping works and what customers should expect after checkout.",
    to: "/support/shipping-returns",
    icon: Truck,
  },
  {
    title: "Seller Policies",
    description: "Understand the seller-side rules for product listings, order handling, and marketplace conduct.",
    to: "/support/seller-policies",
    icon: Store,
  },
  {
    title: "Privacy Policy",
    description: "See how account data, order information, and marketplace activity are handled.",
    to: "/support/privacy-policy",
    icon: ShieldCheck,
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_30%)]" />

          <div className="relative grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                <Sparkles size={15} />
                Support Center
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Help, policies, and marketplace guidance in one place
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Explore support articles, shipping and return guidance, seller rules,
                and privacy information through one clean help hub.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Quick Access</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  4 Core Pages
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Everything customers and sellers need most.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">Marketplace Ready</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  Clean & Clear
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Helpful content that matches your platform UI.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {supportLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon size={20} />
                </div>

                <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-700">
                  View page
                  <ChevronRight size={16} />
                </span>
              </Link>
            );
          })}
        </section>

        <section className="mt-10 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Need a clean support area?
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                These pages are designed to match your current modern marketplace
                styling, so users get a consistent experience from homepage to support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}