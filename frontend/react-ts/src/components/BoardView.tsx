// BoardView.tsx
import { useState } from "react";
import { IBoard, IColumn, ICard } from "../types/kanbanTypes";
import { createColumn, updateColumnOrder } from "../api/columnApi";
import { updateCardOrder, updateCard } from "../api/cardApi";
import { ColumnItem } from "./ColumnItem";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface BoardViewProps {
  board: IBoard;
}

export function BoardView({ board}: BoardViewProps) {
  const [columns, setColumns] = useState<IColumn[]>(board.columns);
  const [newColName, setNewColName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddColumn() {
    if (!newColName.trim()) return;
    setError(null);
    setIsLoading(true);
    try {
      const col = await createColumn(board._id, newColName);
      setColumns((prev) => [...prev, col]);
      setNewColName("");
    } catch (err) {
      setError("Failed to create column");
    } finally {
      setIsLoading(false);
    }
  }

  // Remove a column from state
  function handleDeleteColumn(deletedColumnId: string) {
    setColumns((prev) => prev.filter((col) => col._id !== deletedColumnId));
  }

  // Update columns cards
  function handleUpdateCards(columnId: string, newCards: ICard[]) {
    setColumns(prev =>
      prev.map(col => (col._id === columnId ? { ...col, cards: newCards } : col))
    );
  }

  // onDragEnd handles both column and card drags.
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
  
    if (type === "COLUMN") {
      // --- COLUMN REORDERING ---
      const newColumns = Array.from(columns);
      const [moved] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, moved);
      
      // Update the order for each column based on new index
      newColumns.forEach((col, index) => {
        col.order = index;
      });
      setColumns(newColumns);
      
      // Persist the new column order to the backend
      try {
        await updateColumnOrder(
          board._id,
          newColumns.map(col => ({ id: col._id, order: col.order ?? 0 }))
        );
      } catch (err) {
        console.error("Failed to update column order", err);
      }
    } else if (type === "CARD") {
      // --- CARD REORDERING ---
      // Identify source and destination columns using droppableId
      const sourceColIndex = columns.findIndex(col => col._id === source.droppableId);
      const destColIndex = columns.findIndex(col => col._id === destination.droppableId);
      if (sourceColIndex === -1 || destColIndex === -1) return;
      
      const sourceColumn = columns[sourceColIndex];
      const destColumn = columns[destColIndex];
      const sourceCards = Array.from(sourceColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      
      if (source.droppableId === destination.droppableId) {
        // --- Reordering within the same column ---
        sourceCards.splice(destination.index, 0, movedCard);
        sourceCards.forEach((card, index) => {
          card.order = index;
        });
        const updatedColumns = [...columns];
        updatedColumns[sourceColIndex] = { ...sourceColumn, cards: sourceCards };
        setColumns(updatedColumns);
        
        try {
          await updateCardOrder(
            sourceColumn._id,
            sourceCards.map(card => ({ id: card._id, order: card.order ?? 0 }))
          );
        } catch (err) {
          console.error("Failed to update card order", err);
        }
      } else {
        // --- Moving a card between columns ---
        const destCards = Array.from(destColumn.cards);
        destCards.splice(destination.index, 0, movedCard);
        // Update orders for cards in both columns
        sourceCards.forEach((card, index) => {
          card.order = index;
        });
        destCards.forEach((card, index) => {
          card.order = index;
        });
        // Update the moved card's column membership
        movedCard.columnId = destColumn._id;
        
        const updatedColumns = [...columns];
        updatedColumns[sourceColIndex] = { ...sourceColumn, cards: sourceCards };
        updatedColumns[destColIndex] = { ...destColumn, cards: destCards };
        setColumns(updatedColumns);
        
        try {
          // Persist updated orders in the source column
          await updateCardOrder(
            sourceColumn._id,
            sourceCards.map(card => ({ id: card._id, order: card.order ?? 0 }))
          );
          // Persist updated orders in the destination column
          await updateCardOrder(
            destColumn._id,
            destCards.map(card => ({ id: card._id, order: card.order ?? 0 }))
          );
          // Additionally, update the moved card's columnId in the backend
          await updateCard(movedCard._id, { newColumnId: destColumn._id, order: movedCard.order ?? 0 });
        } catch (err) {
          console.error("Failed to update card order across columns", err);
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 text-white">Board: {board.name}</h1>

      {/* Create Column Input and Button */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          className="border p-1 bg-gray-700 text-white"
          placeholder="New Column Name"
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
        />
        <button
          onClick={handleAddColumn}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 text-white"
        >
          {isLoading ? "Creating..." : "Add Column"}
        </button>
        {error && <div className="text-red-500 ml-2">{error}</div>}
      </div>

      {/* Wrap the columns in a DragDropContext */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="columns-droppable"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="flex flex-wrap gap-4">
                {columns.map((col, index) => (
                  <Draggable key={col._id} draggableId={col._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ColumnItem
                          column={col}
                          onDeleteColumn={handleDeleteColumn}
                          onUpdateCards={handleUpdateCards}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
