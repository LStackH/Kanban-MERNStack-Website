import mongoose, { Schema, Document } from "mongoose";
import { ICard } from "./cardModel";

export interface IColumn extends Document {
  name: string;
  cards: mongoose.Types.ObjectId[]; // array of card ids
  boardId: mongoose.Types.ObjectId[]; // reference to the board-parent
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ColumnSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: { type: Number, default: 0 }, // track the columns position
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.model<IColumn>("Column", ColumnSchema);
export default Column;
