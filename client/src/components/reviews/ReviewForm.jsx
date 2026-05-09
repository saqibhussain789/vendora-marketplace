import { useEffect, useState } from "react";
import { MessageSquareText, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StarRating from "./StarRating";

export default function ReviewForm({
  existingReview = null,
  onSubmit,
  onDelete,
  isSubmitting = false,
  canReview = true,
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");

  useEffect(() => {
    setRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || "");
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canReview) return;

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    await onSubmit?.({
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <MessageSquareText size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            {existingReview ? "Update Your Review" : "Write a Review"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Share your experience with this product.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Your Rating
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          interactive
          size={22}
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Your Review
        </label>
        <textarea
          rows="5"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
          disabled={!canReview || isSubmitting}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!canReview || isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {isSubmitting
            ? existingReview
              ? "Updating..."
              : "Submitting..."
            : existingReview
            ? "Update Review"
            : "Submit Review"}
        </button>

        {existingReview ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            Delete Review
          </button>
        ) : null}
      </div>
    </form>
  );
}