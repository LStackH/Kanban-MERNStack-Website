import { useState } from "react";
import { IComment } from "../types/kanbanTypes";
import { updateComment, deleteComment } from "../api/commentApi";
import { InlineEdit } from "./InlineEdit";

interface CommentItemProps {
  comment: IComment;
  onDelete: (commentId: string) => void;
  onUpdate: (updatedComment: IComment) => void;
}

// Comments for cards, used in CardItem component
export function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(comment._id);
        onDelete(comment._id);
      } catch (err) {
        setError("Failed to delete comment");
      }
    }
  }

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <InlineEdit
          value={comment.text}
          onSave={async (newText) => {
            const updated = await updateComment(comment._id, { text: newText });
            onUpdate(updated);
          }}
          className="text-s font-extralight text-zinc-300"
          inputClassName="border p-1 bg-gray-800 text-white text-xs w-full"
        />
        <div className="flex space-x-1 mt-0.5">
          <button
            onClick={handleDelete}
            className="text-xs text-red-300 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Created: {new Date(comment.createdAt).toLocaleString()} | Updated:{" "}
        {new Date(comment.updatedAt).toLocaleString()}
      </div>
      {error && <div className="text-red-500 text-xxs">{error}</div>}
    </div>
  );
}