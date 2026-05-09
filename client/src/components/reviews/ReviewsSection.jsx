import { useEffect, useMemo, useState } from "react";
import { MessageSquareMore } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import {
    addOrUpdateProductReviewApi,
    deleteMyProductReviewApi,
    getProductReviewsApi,
    getReviewEligibilityApi,
} from "../../api/reviewApi";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

const formatReviewDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
};

export default function ReviewsSection({ product }) {
    const { user, isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [ratings, setRatings] = useState(Number(product?.ratings || 0));
    const [numReviews, setNumReviews] = useState(Number(product?.numReviews || 0));
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [eligibilityReason, setEligibilityReason] = useState("");
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!product?._id) return;

            try {
                setIsLoading(true);

                const data = await getProductReviewsApi(product._id);
                setReviews(data.reviews || []);
                setRatings(Number(data.product?.ratings || 0));
                setNumReviews(Number(data.product?.numReviews || 0));
            } catch (error) {
                console.error("fetchReviews error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [product?._id]);

    useEffect(() => {
        const checkEligibility = async () => {
            if (!product?._id) return;

            if (!isAuthenticated) {
                setCanReview(false);
                setEligibilityReason("Please log in as a customer to write a review.");
                setIsCheckingEligibility(false);
                return;
            }

            try {
                setIsCheckingEligibility(true);

                const data = await getReviewEligibilityApi(product._id);
                setCanReview(Boolean(data.canReview));
                setEligibilityReason(data.reason || "");
            } catch (error) {
                const message =
                    error?.response?.data?.message || "Unable to check review eligibility";
                setCanReview(false);
                setEligibilityReason(message);
            } finally {
                setIsCheckingEligibility(false);
            }
        };

        checkEligibility();
    }, [product?._id, isAuthenticated]);

    const myReview = useMemo(() => {
        if (!user?._id) return null;

        return reviews.find(
            (review) => String(review.userId) === String(user._id)
        );
    }, [reviews, user?._id]);


    const handleSubmitReview = async (payload) => {
        if (!product?._id) return;

        try {
            setIsSubmittingReview(true);

            const data = await addOrUpdateProductReviewApi(product._id, payload);

            setReviews(data.reviews || []);
            setRatings(Number(data.product?.ratings || 0));
            setNumReviews(Number(data.product?.numReviews || 0));

            toast.success(data.message || "Review saved successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!product?._id) return;

        try {
            setIsSubmittingReview(true);

            const data = await deleteMyProductReviewApi(product._id);

            setReviews(data.reviews || []);
            setRatings(Number(data.product?.ratings || 0));
            setNumReviews(Number(data.product?.numReviews || 0));

            toast.success(data.message || "Review deleted successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <section className="mt-14">
            <section className="mt-14 space-y-6">
  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <MessageSquareMore size={20} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">
          Ratings & Reviews
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          See what customers think about this product.
        </p>
      </div>
    </div>

    <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-4xl font-bold tracking-tight text-slate-950">
            {ratings.toFixed(1)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Average rating from {numReviews} review{numReviews !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end">
          <StarRating value={Math.round(ratings)} size={22} />
          <p className="mt-2 text-xs text-slate-500">
            Based on verified customer feedback
          </p>
        </div>
      </div>
    </div>

    {isCheckingEligibility ? (
      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        Checking review access...
      </div>
    ) : !canReview ? (
      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
        {eligibilityReason || "You cannot review this product right now."}
      </div>
    ) : (
      <div className="mt-6">
        <ReviewForm
          existingReview={myReview}
          onSubmit={handleSubmitReview}
          onDelete={handleDeleteReview}
          isSubmitting={isSubmittingReview}
          canReview={canReview}
        />
      </div>
    )}
  </div>

  <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-xl font-semibold text-slate-950">Customer Reviews</h3>
    <p className="mt-1 text-sm text-slate-500">
      Latest reviews from customers who reviewed this product.
    </p>

    <div className="mt-6 space-y-4">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-3 w-full animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        ))
      ) : reviews.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
          <p className="text-base font-medium text-slate-900">
            No reviews yet
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Be the first customer to review this product.
          </p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-950">
                  {review.userName}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating value={review.rating} size={18} />
                  <span className="text-xs text-slate-500">
                    {formatReviewDate(review.createdAt)}
                  </span>
                </div>
              </div>

              {user?._id && String(review.userId) === String(user._id) ? (
                <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200">
                  Your review
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {review.comment}
            </p>
          </div>
        ))
      )}
    </div>
  </div>
</section>
        </section>
    );
}