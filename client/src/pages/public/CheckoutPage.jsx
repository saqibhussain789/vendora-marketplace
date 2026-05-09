import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Store,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  PackageCheck,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { placeOrderApi } from "../../api/orderApi";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { groupedCartItems, getSellerCartById, clearSellerCart } = useCart();

  const selectedSellerGroup =
    getSellerCartById(sellerId) ||
    groupedCartItems.find((group) => group.sellerId === sellerId) ||
    null;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasItems = selectedSellerGroup?.items?.length > 0;

  useEffect(() => {
    if (!user) return;

    const defaultAddress =
      user.addresses?.find((addr) => addr.isDefault) || user.addresses?.[0];

    setFormData({
      fullName: defaultAddress?.fullName || user.name || "",
      email: user.email || "",
      phone: defaultAddress?.phone || user.phone || "",
      address: defaultAddress?.street || "",
      city: defaultAddress?.city || "",
      state: defaultAddress?.state || "",
      postalCode: defaultAddress?.postalCode || "",
      country: defaultAddress?.country || "",
    });
  }, [user]);

  const sellerSubtotal = useMemo(() => {
    return Number(selectedSellerGroup?.sellerSubtotal || 0);
  }, [selectedSellerGroup]);

  const estimatedShipping = useMemo(() => {
    if (!hasItems) return 0;
    return sellerSubtotal >= 500 ? 0 : 25;
  }, [sellerSubtotal, hasItems]);

  const grandTotal = useMemo(() => {
    return sellerSubtotal + estimatedShipping;
  }, [sellerSubtotal, estimatedShipping]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place your order");
      navigate("/login");
      return false;
    }

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.postalCode.trim() ||
      !formData.country.trim()
    ) {
      toast.error("Please fill all shipping fields");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!hasItems || !selectedSellerGroup) {
      toast.error("This seller cart is empty");
      return;
    }

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        sellerId: selectedSellerGroup.sellerId,
        items: selectedSellerGroup.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      const data = await placeOrderApi(payload);

      toast.success("Order placed successfully");
      clearSellerCart(selectedSellerGroup.sellerId);

      navigate("/order-success", {
        replace: true,
        state: {
          orderId: data.order?._id,
          orderNumber: data.order?.orderNumber,
          sellerOrderRef: data.order?.sellerOrderRef,
        },
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasItems || !selectedSellerGroup) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
            <p className="mt-3 text-slate-600">
              No items found for this seller checkout.
            </p>

            <Link
              to="/cart"
              className="mt-6 inline-flex rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Shipping Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Enter the address where this order should be delivered.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State / Province"
                    value={formData.state}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Checkout Notes
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    This order will only be created for one seller.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                If your cart contains products from other sellers, place separate
                checkouts for them from the cart page.
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Store size={16} />
                <span>{selectedSellerGroup.sellerName}</span>
              </div>

              <h2 className="text-2xl font-semibold text-slate-950">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3">
                {selectedSellerGroup.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="whitespace-nowrap text-sm font-semibold text-slate-950">
                      {(item.price * item.quantity).toFixed(2)} $
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Items</span>
                  <span>{selectedSellerGroup.sellerItemCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{sellerSubtotal.toFixed(2)} $</span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Estimated Shipping</span>
                  <span>
                    {estimatedShipping === 0
                      ? "Free"
                      : `${estimatedShipping.toFixed(2)} $`}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-end justify-between gap-4">
                    <span className="text-base font-semibold text-slate-950">
                      Total
                    </span>
                    <span className="text-3xl font-bold tracking-tight text-slate-950">
                      {grandTotal.toFixed(2)} $
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Back to Cart
              </Link>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Shipping and final totals are calculated specifically for this
                seller checkout.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}