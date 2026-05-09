import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getSellerProducts,
  getSingleSellerProduct,
  createProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from "../controllers/sellerProductController.js";

const router = express.Router();

router.use(protect, authorizeRoles("seller", "admin"));

router.get("/products", getSellerProducts);
router.get("/products/:id", getSingleSellerProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateSellerProduct);
router.delete("/products/:id", deleteSellerProduct);

export default router;