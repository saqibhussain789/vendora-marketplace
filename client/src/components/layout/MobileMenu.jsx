import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingCart, LayoutDashboard, Search } from "lucide-react";
import Logo from "../../assets/logos/Logo.png";

export default function MobileMenu({
  isOpen,
  onClose,
  dashboardPath = "/dashboard",
  initialSearch = "",
}) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(initialSearch || "");

  const handleSearchSubmit = () => {
    const search = searchInput.trim();

    onClose();

    if (!search) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed left-0 top-0 z-50 h-screen w-[85%] max-w-sm border-r border-slate-800 bg-slate-950 p-5 shadow-2xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={Logo}
              alt="Vendora logo"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </Link>

          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">
          <div className="relative">
            <Search
              size={18}
              onClick={handleSearchSubmit}
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-900 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            Products
          </Link>

          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <ShoppingCart size={17} />
            Cart
          </Link>

          <Link
            to={dashboardPath}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}