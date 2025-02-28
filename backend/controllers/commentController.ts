import { Request, Response } from "express";
import Card from "../models/cardModel";
import Comment from "../models/commentModel";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Create a new comment in a card
// @route   POST /api/comments
// @access  Private (user)
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { cardId, text } = req.body;

    if (!cardId || !text) {
      res.status(400).json({ error: "cardId and text are required" });
      return;
    }

    const card = await Card.findById(cardId);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    const newComment = await Comment.create({ text, cardId });
    // Add the comment reference to the card
    card.comments.push(newComment.id);
    await card.save();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:cardId
// @access  Private (user)
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    comment.text = text || comment.text;
    await comment.save();
    res.status(200).json({ comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comment/:cardId
// @access  Private (user)
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    // Remove comment reference from the card
    await Card.findByIdAndUpdate(comment.cardId, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};
