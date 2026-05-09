import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MobileMenu from "./MobileMenu";
import { useCart } from "../../context/CartContext";
import Logo from "../../assets/logos/Logo.png";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "seller") return "/seller";
    return "/dashboard";
  };

  const handleSearchSubmit = () => {
    const search = searchInput.trim();

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
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex min-h-[82px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img
                src={Logo}
                alt="Vendora logo"
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              to="/"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Products
            </Link>
          </nav>

          <div className="hidden xl:block">
            <div className="relative w-[340px]">
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
                placeholder="Search products, brands, categories..."
                className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-teal-600 px-1.5 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="hidden items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 sm:inline-flex"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-900 px-4 py-3 sm:px-6 xl:hidden">
          <div className="relative mx-auto max-w-7xl">
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
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        dashboardPath={getDashboardPath()}
        initialSearch={searchInput}
      />
    </>
  );
}