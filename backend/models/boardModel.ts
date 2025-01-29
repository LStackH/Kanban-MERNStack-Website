import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  columns: mongoose.Types.ObjectId[]; // array of column id's
  userId: mongoose.Types.ObjectId[]; // Reference to the User-Parent
}

const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Column" }], // Reference to Column model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model<IBoard>("Board", BoardSchema);
export default Board;
