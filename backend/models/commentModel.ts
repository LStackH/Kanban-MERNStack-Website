import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  cardId: mongoose.Types.ObjectId; // reference to parent card
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
