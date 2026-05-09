import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, ShoppingCart, UserCircle2, Store, Package } from "lucide-react";

const sections = [
  {
    title: "Account & Login",
    icon: UserCircle2,
    points: [
      "Create an account as a customer or seller.",
      "Log in to manage orders, products, and profile details.",
      "Use the password recovery flow if you cannot access your account.",
    ],
  },
  {
    title: "Products & Browsing",
    icon: Package,
    points: [
      "Browse products by category or search by keyword.",
      "Visit individual product pages for pricing, stock, and seller information.",
      "Use the AI assistant for quick product help and recommendations.",
    ],
  },
  {
    title: "Cart & Checkout",
    icon: ShoppingCart,
    points: [
      "Add items to your cart and update quantities anytime.",
      "Checkout is handled seller-wise for cleaner shipping and order flow.",
      "Enter your shipping details carefully before placing an order.",
    ],
  },
  {
    title: "Seller Support",
    icon: Store,
    points: [
      "Sellers can manage products, view orders, and update fulfillment status.",
      "Keep product details, stock, and pricing accurate.",
      "Use your dashboard to track store activity in one place.",
    ],
  },
];

export default function HelpCenterPage() {
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
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <HelpCircle size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-teal-700">Help Center</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Answers to the most common marketplace questions
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Use this page as a simple guide for account access, shopping,
                checkout, and seller workflows.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon size={20} />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {section.title}
                </h2>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  {section.points.map((point) => (
                    <li key={point} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}