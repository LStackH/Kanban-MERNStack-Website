import { Request, Response } from "express";
import Board from "../models/boardModel";
import Column from "../models/columnModel";
import User from "../models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Get all boards of the authenticated user
// @route   GET /api/boards
// @access  Private (user)
export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; // from authMiddleware
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Fetch boards that belong to this user, and populate with columns and their cards
    const boards = await Board.find({ userId }).populate({
      path: "columns",
      populate: { path: "cards" },
    });

    res.status(200).json({ boards });
    return;
  } catch (error) {
    console.error("Error getting boards:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// NOT CURRENTLY IN USE
// @desc    Get a single board by ID
// @route   GET /api/boards/:boardId
// @access  Private (user)
export const getBoardById = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const userId = req.userId;

    // Fetch a board that belong to this user, and populate with columns and their cards
    const board = await Board.findOne({ _id: boardId, userId }).populate({
      path: "columns",
      populate: { path: "cards" },
    });

    if (!board) {
      res.status(404).json({ error: "Board not found" });
      return;
    }

    res.status(200).json({ board });
    return;
  } catch (error) {
    console.error("Error getting board:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private (user)
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Board name is required" });
      return;
    }

    const newBoard = await Board.create({
      name,
      userId: userId, // link board to the logged-in user
      columns: [],
    });

    res.status(201).json({ board: newBoard });
    return;
  } catch (error) {
    console.error("Error creating board:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Update (rename) a board
// @route   PUT /api/boards/:boardId
// @access  Private (user)
export const updateBoard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { boardId } = req.params;
    const { name } = req.body;

    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId, userId },
      { name },
      { new: true }
    );

    if (!updatedBoard) {
      res.status(404).json({ error: "Board not found or not yours" });
      return;
    }

    res.status(200).json({ board: updatedBoard });
    return;
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Delete a board
// @route   DELETE /api/boards/:boardId
// @access  Private (user)
export const deleteBoard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { boardId } = req.params;

    // Find and delete
    const deletedBoard = await Board.findOneAndDelete({ _id: boardId, userId });
    if (!deletedBoard) {
      res.status(404).json({ error: "Board not found or not yours" });
      return;
    }

    // delete columns and cards under this board
    const columns = await Column.find({ boardId: boardId });
    for (const col of columns) {
      col.deleteOne();
    }
    await Column.deleteMany({ boardId: boardId });

    res.status(200).json({ message: "Board deleted", boardId });
    return;
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
