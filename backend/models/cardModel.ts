import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICard extends Document {
  title: string;
  description: string;
  columnId: Types.ObjectId; // refenrece to parent column
  order?: number;
  comments: Types.ObjectId[]; // array of comments in card
  createdAt?: Date;
  updatedAt?: Date;
}

const cardSchema = new Schema<ICard>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    order: { type: Number, default: 0 }, // track the card's position
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Card = mongoose.model<ICard>("Card", cardSchema);
export default Card;
