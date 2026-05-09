export default function StatusBadge({ status = "", type = "order", prefix = "" }) {
  const value = String(status || "").toLowerCase();

  const getClasses = () => {
    if (type === "payment") {
      if (value === "paid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      if (value === "failed") return "bg-rose-50 text-rose-700 ring-rose-200";
      return "bg-slate-100 text-slate-700 ring-slate-200";
    }

    if (value === "delivered") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (value === "shipped") return "bg-sky-50 text-sky-700 ring-sky-200";
    if (value === "processing") return "bg-amber-50 text-amber-700 ring-amber-200";
    if (value === "cancelled") return "bg-rose-50 text-rose-700 ring-rose-200";
    if (value === "mixed") return "bg-violet-50 text-violet-700 ring-violet-200";
    return "bg-slate-100 text-slate-700 ring-slate-200";
  };

  const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${getClasses()}`}
    >
      {prefix ? `${prefix}: ` : ""}
      {label}
    </span>
  );
}