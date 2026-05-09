import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { recalculateProductRatings } from "../utils/reviewHelpers.js";

const hasDeliveredProductPurchase = async (userId, productId) => {
    const order = await Order.findOne({
        userId,
        items: {
            $elemMatch: {
                productId,
                fulfillmentStatus: "delivered",
            },
        },
    }).select("_id");

    return Boolean(order);
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
        }).select("name ratings numReviews reviews");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const reviews = [...(product.reviews || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            product: {
                _id: product._id,
                name: product.name,
                ratings: product.ratings,
                numReviews: product.numReviews,
            },
            reviews,
        });
    } catch (error) {
        console.error("getProductReviews error:", error);
        res.status(500).json({ message: "Failed to load reviews" });
    }
};

export const addOrUpdateProductReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const numericRating = Number(rating);

        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        if (!String(comment || "").trim()) {
            return res.status(400).json({ message: "Review comment is required" });
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (String(product.sellerId) === String(req.user._id)) {
            return res.status(403).json({ message: "You cannot review your own product" });
        }

        const isVerifiedBuyer = await hasDeliveredProductPurchase(
            req.user._id,
            product._id
        );

        if (!isVerifiedBuyer) {
            return res.status(403).json({
                message: "You can only review products you have purchased and received",
            });
        }

        const existingReview = product.reviews.find(
            (review) => String(review.userId) === String(req.user._id)
        );

        if (existingReview) {
            existingReview.rating = numericRating;
            existingReview.comment = String(comment).trim();
            existingReview.userName = req.user.name;
        } else {
            product.reviews.push({
                userId: req.user._id,
                userName: req.user.name,
                rating: numericRating,
                comment: String(comment).trim(),
            });
        }

        recalculateProductRatings(product);
        await product.save();

        res.status(200).json({
            success: true,
            message: existingReview
                ? "Review updated successfully"
                : "Review added successfully",
            product: {
                _id: product._id,
                ratings: product.ratings,
                numReviews: product.numReviews,
            },
            reviews: product.reviews.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
        });
    } catch (error) {
        console.error("addOrUpdateProductReview error:", error);
        res.status(500).json({ message: "Failed to save review" });
    }
};

export const deleteMyProductReview = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingReview = product.reviews.find(
            (review) => String(review.userId) === String(req.user._id)
        );

        if (!existingReview) {
            return res.status(404).json({ message: "Your review was not found" });
        }

        product.reviews = product.reviews.filter(
            (review) => String(review.userId) !== String(req.user._id)
        );

        recalculateProductRatings(product);
        await product.save();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            product: {
                _id: product._id,
                ratings: product.ratings,
                numReviews: product.numReviews,
            },
            reviews: product.reviews.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            ),
        });
    } catch (error) {
        console.error("deleteMyProductReview error:", error);
        res.status(500).json({ message: "Failed to delete review" });
    }
};

export const getReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    }).select("sellerId");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!req.user) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "Please log in as a customer to write a review.",
      });
    }

    if (req.user.role !== "customer") {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "Only customer accounts can write reviews.",
      });
    }

    if (String(product.sellerId) === String(req.user._id)) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "You cannot review your own product.",
      });
    }

    const isVerifiedBuyer = await hasDeliveredProductPurchase(
      req.user._id,
      product._id
    );

    if (!isVerifiedBuyer) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: "You can only review products you have purchased and received.",
      });
    }

    return res.status(200).json({
      success: true,
      canReview: true,
      reason: "",
    });
  } catch (error) {
    console.error("getReviewEligibility error:", error);
    res.status(500).json({ message: "Failed to check review eligibility" });
  }
};