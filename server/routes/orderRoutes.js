import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/admin", protect, authorizeRoles("admin"), getAllOrdersAdmin);
router.put("/admin/:id/status", protect, authorizeRoles("admin"), updateOrderStatusAdmin);
router.get("/:id", protect, getSingleOrder);

export default router;