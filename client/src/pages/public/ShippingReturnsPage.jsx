import { Link } from "react-router-dom";
import { ArrowLeft, Truck, PackageCheck, RefreshCcw } from "lucide-react";

const cards = [
  {
    title: "Shipping Flow",
    icon: Truck,
    text: "Orders are handled seller-wise so shipping stays cleaner and easier to manage when multiple sellers are involved.",
  },
  {
    title: "Order Processing",
    icon: PackageCheck,
    text: "After checkout, sellers review incoming orders and update fulfillment progress directly from their dashboard.",
  },
  {
    title: "Returns Guidance",
    icon: RefreshCcw,
    text: "Return handling depends on platform rules and seller-side conditions. Customers should review the latest support guidance before requesting a return.",
  },
];

export default function ShippingReturnsPage() {
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
          <p className="text-sm font-medium text-teal-700">Shipping & Returns</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Clear guidance for delivery, checkout, and returns
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            This marketplace uses a seller-wise order flow, so products from different
            sellers are handled separately during checkout and fulfillment.
          </p>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <section
                key={card.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {card.text}
                </p>
              </section>
            );
          })}
        </div>

        <section className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Important notes
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              Shipping costs and timelines may vary depending on the seller and the
              products included in that seller checkout.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              Customers should review order details carefully before placing an order,
              especially when multiple sellers are involved.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}