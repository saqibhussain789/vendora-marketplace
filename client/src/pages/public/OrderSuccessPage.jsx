import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  ReceiptText,
  Store,
  Sparkles,
} from "lucide-react";

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || "";
  const sellerOrderRef = location.state?.sellerOrderRef || "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_30%)]" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[24px] bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <CheckCircle2 size={34} />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                <Sparkles size={15} />
                Order Confirmed
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Your order has been placed successfully
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Your checkout has been completed and the order has been saved in
                the marketplace system. You can continue shopping or review your
                order details from your dashboard.
              </p>
            </div>

            {(orderNumber || sellerOrderRef) && (
              <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
                {orderNumber ? (
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <ReceiptText size={16} />
                      Order Number
                    </div>
                    <p className="mt-3 break-all text-xl font-bold tracking-tight text-slate-950">
                      {orderNumber}
                    </p>
                  </div>
                ) : null}

                {sellerOrderRef ? (
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Store size={16} />
                      Seller Reference
                    </div>
                    <p className="mt-3 break-all text-xl font-bold tracking-tight text-slate-950">
                      {sellerOrderRef}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            <div className="mx-auto mt-10 max-w-3xl rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    Saved
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Checkout
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    Completed
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Next Step
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    Track Order
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/dashboard/orders"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                View Orders
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-slate-500">
              Keep your order number saved for quick reference when reviewing your order later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}