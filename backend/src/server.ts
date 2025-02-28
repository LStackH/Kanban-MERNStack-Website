import express, { Express, Request, Response, RequestHandler } from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "../routes/authRoutes";
import adminRouter from "../routes/adminRoutes";
import boardRouter from "../routes/boardRoutes";
import columnRouter from "../routes/columnRoutes";
import cardRouter from "../routes/cardRoutes";
import commentRouter from "../routes/commentRoutes";
import connectDB from "../config/db";

const app: Express = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5000", // allow request from frontend
    credentials: true, // Allow cookies/auth ehaders
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/boards", boardRouter);
app.use("/api/columns", columnRouter);
app.use("/api/cards", cardRouter);
app.use("/api/comments", commentRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
