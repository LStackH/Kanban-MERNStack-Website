import { useState, useEffect } from "react";
import { IColumn, ICard } from "../types/kanbanTypes";
import { createCard } from "../api/cardApi";
import { deleteColumn, updateColumn } from "../api/columnApi";
import { CardItem } from "./CardItem";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { InlineEdit } from "./InlineEdit";

interface ColumnItemProps {
  column: IColumn;
  onDeleteColumn: (columnId: string) => void;
  setCardsForColumn: (columnId: string, newCards: ICard[] | ((prev: ICard[]) => ICard[])) => void;
}

// Column component, used in BoardView component
export function ColumnItem({ column, onDeleteColumn, setCardsForColumn }: ColumnItemProps) {
  const [name, setName] = useState<string>(column.name);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(column.name);
  }, [column.name]);

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  async function handleAddCard() {
    const title = prompt("Enter card title:");
    if (!title?.trim()) return;
    try {
      const newCard = await createCard(column._id, title);
      // Update parent's state for this column:
      const updatedCards = [...column.cards, newCard];
      setCardsForColumn(column._id, updatedCards);
    } catch (err) {
      setError("Failed to add card");
    }
  }

  async function handleDeleteColumn() {
    if (window.confirm("Are you sure you want to delete this column?")) {
      try {
        await deleteColumn(column._id);
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
        <InlineEdit
          value={name}
          onSave={async (newName) => {
            const updatedColumn = await updateColumn(column._id, { name: newName });
            setName(updatedColumn.name);
          }}
          className="font-bold text-2xl text-white"
          inputClassName="border p-1 bg-gray-800 text-white text-2xl w-full"
        />
        <div className="relative">
          <button onClick={toggleDropdown} className="text-gray-300 hover:text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v.01M12 12v.01M12 18v.01" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded shadow-lg z-10">
              <button onClick={() => { handleAddCard(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600">
                Add Card
              </button>
              <button onClick={() => { setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600">
                Rename Column
              </button>
              <button onClick={() => { handleDeleteColumn(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600">
                Delete Column
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Cards container wrapped in a Droppable for cards */}
      <Droppable droppableId={column._id} type="CARD">
        {(provided) => (
          <div className="flex-1 p-2 overflow-y-auto" ref={provided.innerRef} {...provided.droppableProps}>
            {column.cards.map((card, index) => (
              <Draggable key={card._id} draggableId={card._id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <CardItem
                      card={card}
                      setCards={(newCards) => setCardsForColumn(column._id, newCards)}
                      columnId={column._id}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        )}
      </Droppable>
      {/* Add new card button */}
      <div className="p-2 border-t border-gray-600">
        <button onClick={handleAddCard} className="w-full text-sm text-blue-400 hover:underline">
          + Add New Card
        </button>
      </div>
    </div>
  );
}
