import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProductApi } from "../../api/productApi";

export default function SellerAddProductPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    imagesText: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,
        stock: Number(formData.stock),
        images: formData.imagesText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createProductApi(payload);
      navigate("/seller/products", { replace: true });
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Products / Add Product</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Add Product</h2>
          </div>

          <Link
            to="/seller/products"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Back to Products
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 md:col-span-2"
            required
          />

          <textarea
            name="imagesText"
            placeholder="Image URLs, one per line"
            value={formData.imagesText}
            onChange={handleChange}
            className="min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500 md:col-span-2"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-teal-600 px-5 py-3 text-white font-medium hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}