import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getSellerOrders,
  getSingleSellerOrder,
  updateSellerOrderItemStatus,
} from "../controllers/sellerOrderController.js";

const router = express.Router();

router.use(protect, authorizeRoles("seller"));

router.get("/orders", getSellerOrders);
router.get("/orders/:id", getSingleSellerOrder);
router.put("/orders/:orderId/items/:itemId/status", updateSellerOrderItemStatus);

export default router;