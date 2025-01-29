import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController";

const router = express.Router();

router.get("/", authMiddleware, getBoards);
router.get("/:boardId", authMiddleware, getBoardById);
router.post("/", authMiddleware, createBoard);
router.put("/:boardId", authMiddleware, updateBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);

export default router;
