import { Request, Response } from "express";
import Board from "../models/boardModel";
import Column from "../models/columnModel";
import Card from "../models/cardModel";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Create a new card in a column
// @route   POST /api/cards
// @access  Private (user)
export const createCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { columnId, title, description } = req.body;

    if (!columnId || !title) {
      res.status(400).json({ error: "columnId and card title are required" });
    }

    // Check column
    const column = await Column.findById(columnId);
    if (!column) {
      res.status(404).json({ error: "Column not found" });
      return;
    }

    // Check board ownership
    const board = await Board.findOne({ _id: column.boardId, userId });
    if (!board) {
      res
        .status(403)
        .json({ error: "Not authorized to create cards in this column" });
      return;
    }

    const newCard = await Card.create({
      title,
      description: description || "",
      columnId: column._id,
    });

    // Add card to column
    column.cards.push(newCard.id);
    await column.save();

    res.status(201).json({ card: newCard });
    return;
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Update (move/rename) a card
// @route   PUT /api/cards/:cardId
// @access  Private (user)
export const updateCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { cardId } = req.params;
    const { title, description, newColumnId, order } = req.body;

    const card = await Card.findById(cardId);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    // Check existing column to ensure user has access
    const oldColumn = await Column.findById(card.columnId);
    if (!oldColumn) {
      res.status(404).json({ error: "Card's column not found" });
      return;
    }

    // Check board ownership
    const board = await Board.findOne({ _id: oldColumn.boardId, userId });
    if (!board) {
      res.status(403).json({ error: "Not authorized to update this card" });
      return;
    }

    // Update card fields
    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;

    // If user wants to move the card to another column
    if (newColumnId && newColumnId !== card.columnId.toString()) {
      // Check new column is valid and belongs to the same board
      const newColumn = await Column.findById(newColumnId);
      if (!newColumn) {
        res.status(404).json({ error: "New column not found" });
        return;
      }

      // Check board ownership again
      const newColumnBoard = await Board.findOne({
        _id: newColumn.boardId,
        userId,
      });
      if (!newColumnBoard) {
        res
          .status(403)
          .json({ error: "Not authorized to move to this column" });
        return;
      }

      // Remove card from old column
      oldColumn.cards = oldColumn.cards.filter(
        (cId) => cId.toString() !== cardId
      );
      await oldColumn.save();

      // Add card to new column
      newColumn.cards.push(card.id);
      await newColumn.save();

      card.columnId = newColumn.id;
    }

    // update order
    if (order !== undefined) {
      card.order = order;
    }

    // Save card
    await card.save();

    res.status(200).json({ card });
    return;
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:cardId
// @access  Private (user)
export const deleteCard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    // Check column
    const column = await Column.findById(card.columnId);
    if (!column) {
      res.status(404).json({ error: "Column not found" });
      return;
    }

    // Check board ownership
    const board = await Board.findOne({ _id: column.boardId, userId });
    if (!board) {
      res.status(403).json({ error: "Not authorized to delete this card" });
      return;
    }

    // Remove from column
    column.cards = column.cards.filter((cId) => cId.toString() !== cardId);
    await column.save();

    // Delete card
    await card.deleteOne();

    res.status(200).json({ message: "Card deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
