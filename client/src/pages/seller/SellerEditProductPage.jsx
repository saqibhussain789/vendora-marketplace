import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getSingleSellerProductApi,
  updateSellerProductApi,
} from "../../api/productApi";

export default function SellerEditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    imagesText: "",
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getSingleSellerProductApi(id);
        const product = data.product;

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock || "",
          imagesText: (product.images || []).join("\n"),
          isActive: product.isActive,
        });
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        isActive: formData.isActive,
        images: formData.imagesText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateSellerProductApi(id, payload);
      navigate("/seller/products", { replace: true });
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Products / Edit Product</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Edit Product</h2>
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

          <label className="md:col-span-2 flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Product is active for public listing
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-teal-600 px-5 py-3 text-white font-medium hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}