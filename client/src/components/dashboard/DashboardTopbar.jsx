import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  Menu,
  Search,
  ChevronRight,
  UserCircle2,
  ChevronDown,
} from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";

export default function DashboardTopbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getProfilePath = () => {
    if (user?.role === "admin") return "/admin/profile";
    if (user?.role === "seller") return "/seller/profile";
    return "/dashboard/profile";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex min-h-[78px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="truncate text-slate-500">{title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:block">
            <div className="relative w-[320px]">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search products, orders, users..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <NotificationBell />

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 pr-3 text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "Profile"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                  {getInitials(user?.name || "U")}
                </div>
              )}

              <div className="hidden text-left sm:block">
                <p className="max-w-[120px] truncate text-sm font-medium text-slate-800">
                  {user?.name || "User"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-slate-400 transition ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 z-40 mt-3 w-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || "Profile"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                        {getInitials(user?.name || "U")}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user?.email || "No email"}
                      </p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                        {user?.role || "customer"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to={getProfilePath()}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <UserCircle2 size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 sm:px-6 lg:hidden">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:bg-white"
          />
        </div>
      </div>
    </header>
  );
}