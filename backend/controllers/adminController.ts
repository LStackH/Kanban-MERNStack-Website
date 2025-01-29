import { Response } from "express";
import User from "../models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Get all users (admin only)
// @route   GET /api/admin/all-users
// @access  Admin
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Check admin status
    if (!req.isAdmin) {
      res.status(403).json({ error: "Access denied. Admins only." });
      return;
    }

    const users = await User.find({});
    res.status(200).json({ users });
    return;
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Delete a user (admin only)
// @route   DELETE /api/admin/:userId
// @access  Admin
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    // Check admin status
    if (!req.isAdmin) {
      res.status(403).json({ error: "Access denied. Admins only." });
      return;
    }

    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
      userId: deletedUser._id,
    });
    return;
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
