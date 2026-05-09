import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ImageIcon,
  Package,
  Save,
  Tag,
  FileText,
  UploadCloud,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createProductApi,
  getSingleSellerProductApi,
  updateSellerProductApi,
} from "../../api/productApi";
import { uploadProductImagesApi } from "../../api/uploadApi";

export default function SellerProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getSingleSellerProductApi(id);
        const product = data.product;

        setFormData({
          name: product?.name || "",
          category: product?.category || "",
          brand: product?.brand || "",
          price: product?.price ?? "",
          stock: product?.stock ?? "",
          description: product?.description || "",
          images: product?.images || [],
        });
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUploadImages = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select image files first");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const data = await uploadProductImagesApi(selectedFiles);
      const uploadedUrls = (data.images || []).map((img) => img.url).filter(Boolean);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Images uploaded successfully");
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to upload images";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.category.trim()) {
      toast.error("Category is required");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Enter a valid price");
      return false;
    }

    if (formData.stock === "" || Number(formData.stock) < 0) {
      toast.error("Enter a valid stock value");
      return false;
    }

    if (!formData.images.length) {
      toast.error("Please upload at least one product image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description.trim(),
      images: formData.images,
    };

    try {
      setIsSubmitting(true);
      setError("");

      if (isEditMode) {
        await updateSellerProductApi(id, payload);
        toast.success("Product updated successfully");
        navigate(`/seller/products/${id}`, { replace: true });
      } else {
        const data = await createProductApi(payload);
        const newId = data.product?._id;

        toast.success("Product created successfully");

        if (newId) {
          navigate(`/seller/products/${newId}`, { replace: true });
        } else {
          navigate("/seller/products", { replace: true });
        }
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to save product";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading product form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Basic Information</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Main product details visible in your catalog
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Price (USD)
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Description</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Help customers understand the product clearly
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Product Description
              </label>
              <textarea
                name="description"
                rows="7"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a clear product description..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
              />
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Images</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload product images to Cloudinary
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Select Images
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-teal-600 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-teal-700"
              />

              {selectedFiles.length > 0 ? (
                <div className="mt-4 rounded-2xl bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">
                      {selectedFiles.length} file(s) selected
                    </p>

                    <button
                      type="button"
                      onClick={clearSelectedFiles}
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800"
                    >
                      <X size={14} />
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {selectedFiles.map((file) => (
                      <div
                        key={`${file.name}-${file.lastModified}`}
                        className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={isUploading}
                    className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud size={16} />
                        Upload to Cloudinary
                      </>
                    )}
                  </button>
                </div>
              ) : null}

              <p className="mt-4 text-xs leading-6 text-slate-500">
                Supported image files only. Upload first, then save the product.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <ImageIcon size={16} />
              Image Preview
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {formData.images.length > 0 ? (
                formData.images.slice(0, 6).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm transition hover:bg-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                  No uploaded images yet.
                </div>
              )}
            </div>
          </section>

          <section className="sticky top-24 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Tag size={16} />
              Product Summary
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Name:</span>{" "}
                {formData.name || "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Category:</span>{" "}
                {formData.category || "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Brand:</span>{" "}
                {formData.brand || "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Price:</span>{" "}
                {formData.price !== "" ? `${Number(formData.price).toFixed(2)} USD` : "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Stock:</span>{" "}
                {formData.stock !== "" ? formData.stock : "-"}
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium text-slate-900">Images:</span>{" "}
                {formData.images.length}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              <Save size={16} />
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Product"
                : "Create Product"}
            </button>

            <Link
              to="/seller/products"
              className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </section>
        </div>
      </form>
    </div>
  );
}