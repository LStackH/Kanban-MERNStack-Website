import { useState } from "react";
import { IComment } from "../types/kanbanTypes";
import { updateComment, deleteComment } from "../api/commentApi";

interface CommentItemProps {
  comment: IComment;
  onDelete: (commentId: string) => void;
  onUpdate: (updatedComment: IComment) => void;
}

// CommentItem, located inside a CardItem
export function CommentItem({ comment, onDelete, onUpdate }: CommentItemProps) {
  const [text, setText] = useState(comment.text);
  const [error, setError] = useState<string | null>(null);

  async function handleRename() {
    const newText = prompt("Enter new comment text:", text);
    if (!newText || newText.trim() === text) return;
    try {
      const updated = await updateComment(comment._id, { text: newText });
      setText(updated.text);
      onUpdate(updated);
    } catch (err) {
      setError("Failed to update comment");
    }
  }

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
      <div className="flex-auto justify-between items-center">
        <p className="text-base font-extralight text-gray-300">{text}</p>
        <div className="flex space-x-1">
          <button
            onClick={handleRename}
            className="text-xs text-blue-300 hover:text-blue-500"
          >
            Rename
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-300 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-1 text-xs font-extralight text-gray-500">
        Created: {new Date(comment.createdAt).toLocaleString()} | Updated:{" "}
        {new Date(comment.updatedAt).toLocaleString()}
      </div>
      {error && <div className="text-red-500 text-xxs">{error}</div>}
    </div>
  );
}
