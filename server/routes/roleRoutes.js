import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  sellerDashboard,
  adminDashboard,
} from "../controllers/roleController.js";

const router = express.Router();

router.get("/seller/dashboard", protect, authorizeRoles("seller", "admin"), sellerDashboard);
router.get("/admin/dashboard", protect, authorizeRoles("admin"), adminDashboard);

export default router;