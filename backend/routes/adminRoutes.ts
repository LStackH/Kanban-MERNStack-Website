import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getAllUsers, deleteUser } from "../controllers/adminController";

const router = express.Router();

// GET all users (admin only)
router.get("/all-users", authMiddleware, getAllUsers);

// DELETE user by ID (admin only)
router.delete("/:userId", authMiddleware, deleteUser);

export default router;
