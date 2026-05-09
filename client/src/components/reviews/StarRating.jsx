import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  size = 18,
  interactive = false,
}) {
  const safeValue = Number(value || 0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= safeValue;

        if (interactive) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="inline-flex items-center justify-center"
            >
              <Star
                size={size}
                className={
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }
              />
            </button>
          );
        }

        return (
          <Star
            key={star}
            size={size}
            className={
              filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }
          />
        );
      })}
    </div>
  );
}