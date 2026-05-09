import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadProductImages,
  uploadAvatarImage,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/products/images",
  protect,
  authorizeRoles("seller", "admin"),
  upload.array("images", 5),
  uploadProductImages
);

router.post(
  "/avatar",
  protect,
  upload.single("image"),
  uploadAvatarImage
);

export default router;                  