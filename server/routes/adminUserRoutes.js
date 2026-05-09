import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  getSingleUser,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/users/:id", getSingleUser);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);

export default router;