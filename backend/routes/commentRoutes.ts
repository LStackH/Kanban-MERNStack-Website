import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.put("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
