import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  UserCircle2,
  MapPinHouse,
  X,
  Bell
} from "lucide-react";
import Logo from "../../assets/logos/Logo.png";

const allMenus = {
  admin: [
    { label: "Overview", to: "/admin", icon: LayoutDashboard },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Sellers", to: "/admin/sellers", icon: Store },
    { label: "Products", to: "/admin/products", icon: Package },
    { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
    { label: "Profile", to: "/admin/profile", icon: UserCircle2 },
    { label: "Addresses", to: "/admin/addresses", icon: MapPinHouse },
    { label: "Notifications", to: "/admin/notifications", icon: Bell },
  ],
  seller: [
    { label: "Overview", to: "/seller", icon: LayoutDashboard },
    { label: "Products", to: "/seller/products", icon: Package },
    { label: "Orders", to: "/seller/orders", icon: ShoppingCart },
    { label: "Profile", to: "/seller/profile", icon: UserCircle2 },
    { label: "Addresses", to: "/seller/addresses", icon: MapPinHouse },
    { label: "Notifications", to: "/seller/notifications", icon: Bell },
  ],
  customer: [
    { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", to: "/dashboard/profile", icon: UserCircle2 },
    { label: "Addresses", to: "/dashboard/addresses", icon: MapPinHouse },
    { label: "Orders", to: "/dashboard/orders", icon: ShoppingCart },
    { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
  ],
};

export default function DashboardSidebar({ role = "admin", isOpen, onClose }) {
  const menus = allMenus[role] || [];

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex justify-center border-b border-slate-800 px-5 py-4 sm:py-5">
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-auto object-contain sm:h-12"
          />

          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-1.5">
            {menus.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={
                    item.to === "/admin" ||
                    item.to === "/seller" ||
                    item.to === "/dashboard"
                  }
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                          isActive
                            ? "text-white"
                            : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-teal-400"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}