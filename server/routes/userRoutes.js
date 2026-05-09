import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

export default router;