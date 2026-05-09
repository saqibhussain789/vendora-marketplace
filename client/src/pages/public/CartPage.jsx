import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Store,
  Trash2,
  Sparkles,
  PackageCheck,
  Layers3,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    groupedCartItems,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useCart();

  const hasItems = cartCount > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!hasItems ? (
          <div className="mt-10 rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <ShoppingCart size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add products from the marketplace to continue shopping.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Explore Products
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-700">
                    Seller Groups
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Checkout seller by seller
                  </h2>
                </div>

                <button
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Clear Cart
                </button>
              </div>

              {groupedCartItems.map((group) => (
                <div
                  key={group.sellerId || group.sellerName}
                  className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Store size={16} />
                          <span>{group.sellerName}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {group.sellerItemCount} item{group.sellerItemCount > 1 ? "s" : ""} in this seller checkout
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Seller Subtotal
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-950">
                          {group.sellerSubtotal.toFixed(2)} $
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {group.items.map((item) => (
                      <div
                        key={item.productId}
                        className="grid gap-5 p-6 lg:grid-cols-[92px_1fr_auto_auto] lg:items-center"
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-2xl bg-slate-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-slate-950">
                            {item.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {item.category ? (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                                {item.category}
                              </span>
                            ) : null}

                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
                              {Number(item.price).toFixed(2)} USD each
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-slate-50">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.productId, item.quantity - 1)
                              }
                              className="inline-flex h-11 w-11 items-center justify-center text-slate-500 transition hover:text-slate-900"
                            >
                              <Minus size={16} />
                            </button>

                            <div className="flex min-w-[48px] items-center justify-center text-sm font-semibold text-slate-900">
                              {item.quantity}
                            </div>

                            <button
                              onClick={() =>
                                updateCartQuantity(item.productId, item.quantity + 1)
                              }
                              className="inline-flex h-11 w-11 items-center justify-center text-slate-500 transition hover:text-slate-900"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              removeFromCart(item.productId);
                              toast.success("Item removed from cart");
                            }}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="lg:min-w-[130px] lg:text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            Line Total
                          </p>
                          <p className="mt-1 text-lg font-bold text-slate-950">
                            {(item.price * item.quantity).toFixed(2)} $
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 bg-white px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                        This checkout will only include products from{" "}
                        <span className="font-semibold text-slate-900">
                          {group.sellerName}
                        </span>
                        .
                      </div>

                      <button
                        onClick={() => {
                          toast.success(`Proceeding to ${group.sellerName} checkout`);
                          navigate(`/checkout/${group.sellerId}`);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        Checkout This Seller
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-950">
                  Cart Overview
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Review your marketplace totals before choosing a seller checkout.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Total Items</span>
                    <span className="font-semibold text-slate-950">{cartCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Seller Groups</span>
                    <span className="font-semibold text-slate-950">
                      {groupedCartItems.length}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Items Subtotal
                        </p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                          {cartSubtotal.toFixed(2)} $
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm leading-6 text-slate-600">
                    Shipping charges and final totals are calculated separately
                    for each seller during checkout.
                  </p>
                </div>

                <Link
                  to="/products"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}