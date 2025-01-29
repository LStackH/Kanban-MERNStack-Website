import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  createColumn,
  updateColumn,
  deleteColumn,
} from "../controllers/columnController";

const router = express.Router();

router.post("/", authMiddleware, createColumn);
router.put("/:columnId", authMiddleware, updateColumn);
router.delete("/:columnId", authMiddleware, deleteColumn);

export default router;
