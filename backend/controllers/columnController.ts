import { Request, Response } from "express";
import Board from "../models/boardModel";
import Column from "../models/columnModel";
import Card from "../models/cardModel";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Create a new column in a board
// @route   POST /api/columns
// @access  Private (user)
export const createColumn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { boardId, name } = req.body;

    if (!boardId || !name) {
      res.status(400).json({ error: "boardId and column name are required" });
      return;
    }

    // Check ownership of the board
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      res.status(404).json({ error: "Board not found or not yours" });
      return;
    }

    // Determine the new order: count current columns
    const currentColumns = await Column.find({ boardId });
    const newOrder = currentColumns.length; // this will be 0 if no columns exist

    // Create column
    const newColumn = await Column.create({
      name,
      boardId,
      cards: [],
      order: newOrder, // give an order number, so that we can track it when reordering in frontend
    });

    // Add column to board's columns array
    board.columns.push(newColumn.id);
    await board.save();

    res.status(201).json({ column: newColumn });
    return;
  } catch (error) {
    console.error("Error creating column:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Rename a column
// @route   PUT /api/columns/:columnId
// @access  Private (user)
export const updateColumn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { columnId } = req.params;
    const { name } = req.body;

    // Verify that the column belongs to a board that the user owns
    const column = await Column.findById(columnId);
    if (!column) {
      res.status(404).json({ error: "Column not found" });
      return;
    }

    // Check board ownership
    const board = await Board.findOne({ _id: column.boardId, userId });
    if (!board) {
      res.status(403).json({ error: "Not authorized to edit this column" });
      return;
    }

    column.name = name || column.name;
    await column.save();

    res.status(200).json({ column });
    return;
  } catch (error) {
    console.error("Error updating column:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Update columns order in a board
// @route   PUT /api/columns/order/:boardId
// @access  Private (user)
export const updateColumnOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { boardId } = req.params;
    const { columns } = req.body; // expected format: [{ id: string, order: number }, ...]

    // Check board ownership
    const board = await Board.findOne({ _id: boardId, userId });
    if (!board) {
      res.status(404).json({ error: "Board not found or not yours" });
      return;
    }

    // Update each column's order
    for (const col of columns) {
      await Column.findByIdAndUpdate(col.id, { order: col.order });
    }

    res.status(200).json({ message: "Column order updated successfully" });
  } catch (error) {
    console.error("Error updating column order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Delete a column
// @route   DELETE /api/columns/:columnId
// @access  Private (user)
export const deleteColumn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { columnId } = req.params;

    const column = await Column.findById(columnId);
    if (!column) {
      res.status(404).json({ error: "Column not found" });
      return;
    }

    // Check board ownership
    const board = await Board.findOne({ _id: column.boardId, userId });
    if (!board) {
      res.status(403).json({ error: "Not authorized to delete this column" });
      return;
    }

    // Remove column ID from board's columns array
    board.columns = board.columns.filter(
      (colId) => colId.toString() !== columnId
    );
    await board.save();

    // Delete all cards under the column
    await Card.deleteMany({ _id: { $in: column.cards } });

    // Delete the column
    await column.deleteOne();

    // Recalculate order for remaining columns in the board
    const remainingColumns = await Column.find({ boardId: board._id }).sort(
      "order"
    );
    for (let i = 0; i < remainingColumns.length; i++) {
      remainingColumns[i].order = i;
      await remainingColumns[i].save();
    }

    res.status(200).json({ message: "Column deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting column:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
