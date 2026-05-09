import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const getNotificationTypeClasses = (type = "") => {
  if (type === "order") return "bg-sky-50 text-sky-700 ring-sky-200";
  if (type === "seller") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (type === "admin") return "bg-violet-50 text-violet-700 ring-violet-200";
  if (type === "product") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (type === "account") return "bg-slate-100 text-slate-700 ring-slate-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
};

const getNotificationTypeLabel = (type = "") => {
  if (type === "order") return "Order";
  if (type === "seller") return "Seller";
  if (type === "admin") return "Admin";
  if (type === "product") return "Product";
  if (type === "account") return "Account";
  return "System";
};

export default function NotificationBell() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoadingNotifications,
    fetchNotifications,
    markOneAsRead,
    markAllAsRead,
  } = useNotifications();

  const visibleNotifications = useMemo(() => {
    return notifications.slice(0, 6);
  }, [notifications]);

  const notificationsPagePath = useMemo(() => {
    if (location.pathname.startsWith("/seller")) return "/seller/notifications";
    if (location.pathname.startsWith("/admin")) return "/admin/notifications";
    return "/dashboard/notifications";
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = async () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      await fetchNotifications();
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markOneAsRead(notification._id);
    }

    setIsOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Bell size={18} />

        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-teal-600 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-950">
                Notifications
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You’re all caught up"}
              </p>
            </div>

            {notifications.length > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <CheckCheck size={14} />
                Mark all
              </button>
            ) : null}
          </div>

          <div className="max-h-[420px] overflow-y-auto bg-slate-50 p-3">
            {isLoadingNotifications ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : visibleNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                <p className="text-sm font-medium text-slate-900">
                  No notifications yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  New activity will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleNotifications.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleNotificationClick(item)}
                    className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                      item.isRead
                        ? "border-slate-200 bg-white hover:border-slate-300"
                        : "border-teal-200 bg-teal-50 hover:border-teal-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`truncate text-sm ${
                              item.isRead
                                ? "font-semibold text-slate-900"
                                : "font-bold text-slate-950"
                            }`}
                          >
                            {item.title}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${getNotificationTypeClasses(
                              item.type
                            )}`}
                          >
                            {getNotificationTypeLabel(item.type)}
                          </span>

                          {!item.isRead ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.message}
                        </p>

                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                          <span>{formatRelativeTime(item.createdAt)}</span>
                          {item.link ? (
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <ExternalLink size={13} />
                              Open
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-5 py-3">
            <Link
              to={notificationsPagePath}
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}