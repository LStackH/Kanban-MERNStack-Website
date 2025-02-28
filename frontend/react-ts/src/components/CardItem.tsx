import React, { useState } from "react";
import { ICard, IComment } from "../types/kanbanTypes";
import { updateCard, deleteCard } from "../api/cardApi";
import { createComment } from "../api/commentApi";
import { CommentList } from "./CommentList";

interface CardItemProps {
  card: ICard;
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
  columnId: string;
}

// CardItem, used inside ColumenItem. Handles the renaming, deletion, showing the tite of the card and listing any potential comments in it.
export function CardItem({ card, setCards }: CardItemProps) {
  const [title, setTitle] = useState(card.title);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<IComment[]>(card.comments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  async function handleRename() {
    const newTitle = prompt("Enter new title:", title);
    if (!newTitle || newTitle.trim() === title) return;
    try {
      const updated = await updateCard(card._id, { title: newTitle });
      setTitle(updated.title);
      setCards((prev) =>
        prev.map((c) => (c._id === card._id ? updated : c))
      );
    } catch (err) {
      setError("Failed to update card");
    }
  }

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await deleteCard(card._id);
        setCards((prev) => prev.filter((c) => c._id !== card._id));
      } catch (err) {
        setError("Failed to delete card");
      }
    }
  }

  async function handleAddComment() {
    if (!newCommentText.trim()) return;
    try {
      const newComment = await createComment(card._id, newCommentText);
      setComments((prev) => [...prev, newComment]);
      setNewCommentText("");
    } catch (err) {
      setError("Failed to add comment");
    }
  }

  return (
    <div className="bg-gray-900 p-3 mb-2 rounded shadow">
      {/* Card Header Section */}
      <div className="border-b border-gray-700 pb-2 mb-2">
        <div className="flex-auto justify-between items-center">
          <p className="text-xl font-semibold text-white">{title}</p>
          <div className="flex space-x-2">
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
        <div className="text-xs text-gray-500 mt-1">
          Created: {new Date(card.createdAt).toLocaleString()} | Updated:{" "}
          {new Date(card.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-1">
        <CommentList
          comments={comments}
          onDeleteComment={(commentId) =>
            setComments((prev) => prev.filter((c) => c._id !== commentId))
          }
          onUpdateComment={(updatedComment) =>
            setComments((prev) =>
              prev.map((c) =>
                c._id === updatedComment._id ? updatedComment : c
              )
            )
          }
        />
        {/* Comment input container */}
        <div
          onMouseEnter={() => setShowCommentInput(true)}
          onMouseLeave={() => setShowCommentInput(false)}
          className="mt-1 p-2 border border-gray-700 rounded cursor-pointer"
        >
          {showCommentInput ? (
            <div className="flex space-x-2">
              <input
                type="text"
                className="border p-1 bg-gray-800 text-white text-xs flex-1"
                placeholder="Add a comment"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="px-2 py-1 bg-blue-600 text-white text-xs"
              >
                Add
              </button>
            </div>
          ) : (
            <div className="text-gray-500 text-xs flex items-center">
              💬 Add comment
            </div>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
