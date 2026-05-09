import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPinHouse,
  User,
  Phone,
  MapPin,
  Building2,
  Globe,
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

const isValidPhoneFormat = (value = "") => {
  if (!value.trim()) return false;
  if (!/^[+]?[\d\s\-()]{7,20}$/.test(value.trim())) return false;

  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

export default function AddressesPage() {
  const {
    user,
    addAddress,
    updateAddress,
    deleteAddress,
    isSubmitting,
    error,
    clearError,
  } = useAuth();

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const addressPhoneIsValid =
    formData.phone.length === 0 ? true : isValidPhoneFormat(formData.phone);

  const showAddressPhoneHint = formData.phone.length > 0;

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSuccessMessage("");

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
      isDefault: address.isDefault || false,
    });
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result;

    if (editingId) {
      result = await updateAddress(editingId, formData);
    } else {
      result = await addAddress(formData);
    }

    if (result.success) {
      setSuccessMessage(result.message);
      resetForm();
    }
  };

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) return;

    const result = await deleteAddress(addressId);

    if (result.success) {
      setSuccessMessage(result.message);

      if (editingId === addressId) {
        resetForm();
      }
    }
  };

  const getProfilePath = () => {
    if (user?.role === "admin") return "/admin/profile";
    if (user?.role === "seller") return "/seller/profile";
    return "/dashboard/profile";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <MapPinHouse size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update the selected saved address."
                  : "Create a new shipping address for your account."}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`h-12 w-full rounded-2xl bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white ${showAddressPhoneHint && !addressPhoneIsValid
                    ? "border border-rose-300 focus:border-rose-400"
                    : "border border-slate-200 focus:border-teal-500"
                    }`}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {showAddressPhoneHint ? (
                <p
                  className={`mt-2 text-xs ${addressPhoneIsValid ? "text-slate-500" : "text-rose-600"
                    }`}
                >
                  Enter a valid delivery contact number. Digits, spaces, +, -, and parentheses are allowed.
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Street Address
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                State / Province
              </label>
              <div className="relative">
                <Building2
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Country
              </label>
              <div className="relative">
                <Globe
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              Set as default address
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={16} />
                {isSubmitting
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "Update Address"
                    : "Add Address"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <MapPinHouse size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Saved Addresses
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review, edit, or remove existing addresses.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {user?.addresses?.length ? (
              user.addresses.map((address) => (
                <div
                  key={address._id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-900">
                          {address.fullName}
                        </p>

                        {address.isDefault ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                            Default
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                        <p>{address.phone}</p>
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state}, {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil size={15} />

                      </button>

                      <button
                        onClick={() => handleDelete(address._id)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-medium text-white transition hover:bg-rose-700"
                      >
                        <Trash2 size={15} />

                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                <p className="text-sm text-slate-500">
                  No addresses added yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}