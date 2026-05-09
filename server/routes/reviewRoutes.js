import express from "express";
import {
  addOrUpdateProductReview,
  deleteMyProductReview,
  getProductReviews,
  getReviewEligibility,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.get("/:productId/eligibility", protect, getReviewEligibility);

router.post("/:productId", protect, authorizeRoles("customer"), addOrUpdateProductReview);
router.delete("/:productId", protect, authorizeRoles("customer"), deleteMyProductReview);

export default router;