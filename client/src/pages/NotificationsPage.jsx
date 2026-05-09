import { useMemo } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

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

export default function NotificationsPage() {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    isLoadingNotifications,
    markOneAsRead,
    markAllAsRead,
  } = useNotifications();

  const readCount = useMemo(() => {
    return notifications.filter((item) => item.isRead).length;
  }, [notifications]);

  const handleOpenNotification = async (notification) => {
    if (!notification.isRead) {
      await markOneAsRead(notification._id);
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.08),transparent_30%)]" />

        <div className="relative grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-teal-700">Notifications</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Stay updated with your latest activity
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Review recent marketplace updates, order activity, account alerts,
              and seller-related actions in one place.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Total</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Unread</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">Read</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {readCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                All Notifications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Open a notification to view the related page.
              </p>
            </div>
          </div>

          {notifications.length > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          {isLoadingNotifications ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <p className="text-base font-medium text-slate-900">
                No notifications yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                New marketplace activity will appear here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => handleOpenNotification(item)}
                className={`w-full rounded-[24px] border p-5 text-left shadow-sm transition ${
                  item.isRead
                    ? "border-slate-200 bg-white hover:border-slate-300"
                    : "border-teal-200 bg-teal-50/50 hover:border-teal-300"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-slate-950">
                        {item.title}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${getNotificationTypeClasses(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>

                      {!item.isRead ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.message}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>{formatRelativeTime(item.createdAt)}</span>
                      {item.link ? (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <ExternalLink size={13} />
                          Open related page
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {item.isRead ? (
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                      Read
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
                      Unread
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}