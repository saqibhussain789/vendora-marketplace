import { Link } from "react-router-dom";
import { ArrowLeft, Store, BadgeCheck, Package, ShieldCheck } from "lucide-react";

const policySections = [
  {
    title: "Seller Conduct",
    icon: BadgeCheck,
    text: "Sellers should keep their listings accurate, respond to orders responsibly, and maintain clear marketplace behavior.",
  },
  {
    title: "Product Listings",
    icon: Package,
    text: "Product names, pricing, stock, images, and descriptions should stay current so customers can trust what they see.",
  },
  {
    title: "Order Handling",
    icon: Store,
    text: "Sellers are expected to review incoming orders and update fulfillment status in a timely and reliable way.",
  },
  {
    title: "Marketplace Trust",
    icon: ShieldCheck,
    text: "Trust matters. Misleading listings, false stock levels, or poor order handling may lead to seller review or restrictions.",
  },
];

export default function SellerPoliciesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/support"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Support
          </Link>
        </div>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-teal-700">Seller Policies</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Marketplace rules for sellers and store management
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            These policies help create a cleaner marketplace experience for customers,
            sellers, and platform administrators.
          </p>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {policySections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon size={20} />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {section.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {section.text}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}