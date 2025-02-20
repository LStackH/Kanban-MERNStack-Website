import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  createColumn,
  updateColumn,
  deleteColumn,
  updateColumnOrder,
} from "../controllers/columnController";

const router = express.Router();

router.post("/", authMiddleware, createColumn);
router.put("/:columnId", authMiddleware, updateColumn);
router.delete("/:columnId", authMiddleware, deleteColumn);
router.put("/order/:boardId", authMiddleware, updateColumnOrder);

export default router;
