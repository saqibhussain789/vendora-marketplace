import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Mail, Phone, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
};

export default function ProfilePage() {
  const { user, authChecked, updateProfile, isSubmitting, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setSuccessMessage("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploadingAvatar(true);
      setSuccessMessage("");

      const body = new FormData();
      body.append("image", files[0]);

      const response = await fetch("http://localhost:5000/api/uploads/avatar", {
        method: "POST",
        credentials: "include",
        body,
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Upload route not found or server did not return JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to upload avatar");
      }

      const uploadedUrl = data?.image?.url || "";

      if (!uploadedUrl) {
        throw new Error("No uploaded avatar URL returned");
      }

      setFormData((prev) => ({
        ...prev,
        avatar: uploadedUrl,
      }));
    } catch (err) {
      console.error("Avatar upload error:", err);
      setSuccessMessage("");
      alert(err.message || "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccessMessage(result.message);
    }
  };

  const getAddressesPath = () => {
    if (user?.role === "admin") return "/admin/addresses";
    if (user?.role === "seller") return "/seller/addresses";
    return "/dashboard/addresses";
  };

  if (!authChecked) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-lg font-medium text-slate-700">Loading profile...</p>
      </div>
    );
  }

  const initials = getInitials(formData.name || user?.name || "U");

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-sm text-slate-600">
            Update your account details and profile picture.
          </p>
        </div>

        <Link
          to={getAddressesPath()}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Manage Addresses
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-[320px_1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name || "Profile"}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-teal-600 text-3xl font-bold text-white shadow-sm">
                  {initials || "U"}
                </div>
              )}

              <label className="absolute -bottom-1 -right-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-800">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              {formData.name || "User"}
            </h2>
            <p className="mt-1 text-sm capitalize text-slate-500">
              {user?.role || "customer"}
            </p>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Profile photo is optional. If you do not upload one, your initials will be shown instead.
            </p>

            <div className="mt-5 flex w-full flex-col gap-3">
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700">
                <Camera size={16} />
                {uploadingAvatar ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              {formData.avatar ? (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Remove Photo
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <UserIcon
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <div className="relative">
                <Phone
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium capitalize text-slate-800 ring-1 ring-slate-200">
              {user?.role}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}