import express from "express";
import {
  getFeaturedSellers,
  getPublicSellerStore,
} from "../controllers/publicSellerController.js";

const router = express.Router();

router.get("/featured-sellers", getFeaturedSellers);
router.get("/sellers/:sellerId/store", getPublicSellerStore);

export default router;