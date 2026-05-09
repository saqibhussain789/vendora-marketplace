import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", optionalProtect, chatWithAI);

export default router;