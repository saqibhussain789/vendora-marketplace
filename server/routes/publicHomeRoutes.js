import express from "express";
import { getHomePageData } from "../controllers/publicHomeController.js";

const router = express.Router();

router.get("/home", getHomePageData);

export default router;