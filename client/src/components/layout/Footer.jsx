import { Link } from "react-router-dom";
import Logo from "../../assets/logos/Logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="shrink-0">
            <img
              src={Logo}
              alt="Vendora logo"
              className="h-14 w-auto object-contain sm:h-16"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Discover products from multiple sellers in one clean, modern marketplace experience.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/" className="block text-slate-400 hover:text-white">
              Home
            </Link>
            <Link to="/products" className="block text-slate-400 hover:text-white">
              Products
            </Link>
            <Link to="/cart" className="block text-slate-400 hover:text-white">
              Cart
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Account</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/login" className="block text-slate-400 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="block text-slate-400 hover:text-white">
              Register
            </Link>
            <Link to="/dashboard" className="block text-slate-400 hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Account</h3>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/support/help-center" className="block text-slate-400 hover:text-white">
              Help Center
            </Link>
            <Link to="/support/shipping-returns" className="block text-slate-400 hover:text-white">
              Shipping & Returns
            </Link>
            <Link to="/support/seller-policies" className="block text-slate-400 hover:text-white">
              Seller Policies
            </Link>
            <Link to="/support/privacy-policy" className="block text-slate-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/support/faq" className="block text-slate-400 hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        © {currentYear} Vendora AI Marketplace. All rights reserved.
      </div>
    </footer>
  );
}