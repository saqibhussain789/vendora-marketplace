import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, MessageCircleQuestion, Sparkles } from "lucide-react";

const faqItems = [
  {
    question: "How does checkout work in this marketplace?",
    answer:
      "Checkout is handled seller-wise. If your cart contains products from different sellers, each seller's items are checked out separately so shipping and order management stay clean and accurate.",
  },
  {
    question: "Can I buy products from multiple sellers in one order?",
    answer:
      "Not in the current flow. Products from different sellers are split into separate seller checkouts. This helps avoid shipping confusion and keeps each seller responsible for their own order fulfillment.",
  },
  {
    question: "How do I track my order?",
    answer:
      "You can view your order history from your dashboard. Sellers can update item status and tracking numbers, and those updates appear in your order details.",
  },
  {
    question: "What order statuses can I expect?",
    answer:
      "Orders and items can move through statuses like pending, processing, shipped, delivered, or cancelled depending on fulfillment progress.",
  },
  {
    question: "How do sellers manage their orders?",
    answer:
      "Sellers use their dashboard to view received orders, open order details, update item-level fulfillment status, and add tracking numbers when needed.",
  },
  {
    question: "Can sellers edit or remove their products?",
    answer:
      "Yes. Sellers can create, update, view, and delete their own products from the seller dashboard.",
  },
  {
    question: "What happens if a product is out of stock?",
    answer:
      "If a product has no stock available, customers cannot add it to the cart. Stock is checked during both product viewing and order placement flow.",
  },
  {
    question: "How does shipping work?",
    answer:
      "Shipping is managed seller-wise. Delivery timing and shipping conditions may vary depending on the seller and the products in that checkout.",
  },
  {
    question: "Can I update my profile and addresses?",
    answer:
      "Yes. Customers, sellers, and admins can manage profile details and saved addresses from their dashboard.",
  },
  {
    question: "Does the platform have an AI assistant?",
    answer:
      "Yes. The AI assistant can help with product search, recommendations, comparisons, FAQs, and basic order help for logged-in users.",
  },
];

function FaqAccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span className="text-sm font-semibold leading-6 text-slate-950 sm:text-base">
          {item.question}
        </span>

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

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

        <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_30%)]" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <MessageCircleQuestion size={22} />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                  <Sparkles size={15} />
                  FAQ
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Frequently asked questions
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  Find quick answers about shopping, seller workflows, order handling,
                  dashboard access, and the AI assistant.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          {faqItems.map((item, index) => (
            <FaqAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((prev) => (prev === index ? -1 : index))
              }
            />
          ))}
        </section>

        <section className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Still need help?
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            You can also explore the Help Center, Shipping & Returns page, Seller Policies,
            and Privacy Policy for more detailed marketplace guidance.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/support/help-center"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Help Center
            </Link>

            <Link
              to="/support/shipping-returns"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Shipping & Returns
            </Link>

            <Link
              to="/support/seller-policies"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Seller Policies
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}