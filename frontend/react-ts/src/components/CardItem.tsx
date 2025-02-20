import React, { useState } from "react";
import { ICard } from "../types/kanbanTypes";
import { updateCard, deleteCard } from "../api/cardApi";

interface CardItemProps {
  card: ICard;
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>;
  columnId: string;
}

export function CardItem({ card, setCards, columnId }: CardItemProps) {
  const [title, setTitle] = useState(card.title);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="bg-gray-900 p-2 mb-2 rounded shadow">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-white">{title}</p>
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
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
