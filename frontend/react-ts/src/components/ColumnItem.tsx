// src/components/ColumnItem.tsx
import { useState } from "react";
import { IColumn, ICard } from "../types/kanbanTypes";
import { createCard } from "../api/cardApi";
import { deleteColumn, updateColumn } from "../api/columnApi";
import { CardItem } from "./CardItem";

interface ColumnItemProps {
  column: IColumn;
  onDeleteColumn: (columnId: string) => void;
}

export function ColumnItem({ column, onDeleteColumn }: ColumnItemProps) {
  // Local state for cards in this column
  const [cards, setCards] = useState<ICard[]>(column.cards);
  // Local state for the column name
  const [name, setName] = useState<string>(column.name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  async function handleAddCard() {
    const title = prompt("Enter card title:");
    if (!title?.trim()) return;
    try {
      const newCard = await createCard(column._id, title);
      setCards((prev) => [...prev, newCard]);
    } catch (err) {
      setError("Failed to add card");
    }
  }

  async function handleRenameColumn() {
    const newName = prompt("Enter new column name:", name);
    if (!newName || newName.trim() === name) return;
    try {
      const updatedColumn = await updateColumn(column._id, { name: newName });
      // Update local state so the UI reflects the new name
      setName(updatedColumn.name);
    } catch (error) {
      setError("Failed to update column");
    }
  }

  async function handleDeleteColumn() {
    if (window.confirm("Are you sure you want to delete this column?")) {
      try {
        await deleteColumn(column._id);
        // Notify parent to remove this column from the list
        onDeleteColumn(column._id);
      } catch (error) {
        setError("Failed to delete column");
      }
    }
  }

  return (
    <div className="bg-gray-800 rounded shadow flex flex-col w-64">
      {/* Column header with name and dropdown */}
      <div className="flex justify-between items-center border-b border-gray-600 px-2 py-1">
        <h2 className="font-bold text-lg text-white">{name}</h2>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v.01M12 12v.01M12 18v.01"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded shadow-lg z-10">
              <button
                onClick={() => {
                  handleAddCard();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  handleRenameColumn();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
              >
                Rename Column
              </button>
              <button
                onClick={() => {
                  handleDeleteColumn();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
              >
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards container */}
      <div className="flex-1 p-2 overflow-y-auto">
        {cards.map((card) => (
          <CardItem
            key={card._id}
            card={card}
            setCards={setCards}
            columnId={column._id}
          />
        ))}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>

      {/* Add new card button */}
      <div className="p-2 border-t border-gray-600">
        <button
          onClick={handleAddCard}
          className="w-full text-sm text-blue-400 hover:underline"
        >
          + Add New Card
        </button>
      </div>
    </div>
  );
}
