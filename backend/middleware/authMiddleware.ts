import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    // Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in .env");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      isAdmin: boolean;
    };
    req.userId = decoded.userId; // store userId in request object
    req.isAdmin = decoded.isAdmin; // store isAdmin status as well
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};

export default authMiddleware;
