import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Account Information",
    text: "Basic account details such as name, email, phone number, and saved addresses may be stored to support login, checkout, and account management.",
  },
  {
    title: "Order Data",
    text: "Order details, shipping information, and fulfillment status may be stored so customers and sellers can manage purchases and delivery progress.",
  },
  {
    title: "Seller Information",
    text: "Seller-related data may be used to support public storefront visibility, product ownership, and order routing across the marketplace.",
  },
  {
    title: "Platform Usage",
    text: "General marketplace activity may be used to improve product discovery, support experiences, and overall platform performance.",
  },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-teal-700">Privacy Policy</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                How your marketplace data is handled
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                This page gives a clear overview of the main types of information
                that may be stored and used across the platform.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}