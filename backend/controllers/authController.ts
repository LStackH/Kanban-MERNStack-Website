import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

// Helper function to sign JWT
const signToken = (userId: string, isAdmin: boolean) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in .env");
  }

  return jwt.sign(
    {
      userId,
      isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Basic validation
    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists with that email." });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Sign JWT
    const token = signToken(newUser.id, newUser.isAdmin);

    // return user data plus the token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Sign JWT
    const token = signToken(user.id, user.isAdmin);

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
    return;
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
