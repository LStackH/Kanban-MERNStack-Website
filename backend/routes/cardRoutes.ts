import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  createCard,
  updateCard,
  deleteCard,
  updateCardOrder,
} from "../controllers/cardController";

const router = express.Router();

router.post("/", authMiddleware, createCard);
router.put("/:cardId", authMiddleware, updateCard);
router.delete("/:cardId", authMiddleware, deleteCard);
router.put("/order/:columnId", authMiddleware, updateCardOrder);

export default router;
