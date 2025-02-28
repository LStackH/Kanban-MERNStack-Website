import { useState, useCallback } from "react";
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
  searchQuery: string;
}

// BoardView component, handles Drag&Drop functionality, columns
export function BoardView({ board, searchQuery }: BoardViewProps) {
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

  function handleDeleteColumn(deletedColumnId: string) {
    setColumns((prev) => prev.filter((col) => col._id !== deletedColumnId));
  }

  // Sets cards for columns, centralized state management for reordering with drag & drop, to ensure synchronization
  const setCardsForColumn = useCallback(
    (
      columnId: string,
      newCards: ICard[] | ((prev: ICard[]) => ICard[])
    ) => {
      setColumns((prev) =>
        prev.map((col) =>
          col._id === columnId
            ? {
                ...col,
                cards:
                  typeof newCards === "function"
                    ? newCards(col.cards)
                    : newCards,
              }
            : col
        )
      );
    },
    []
  );

  // Filter cards based on searchQuery
  const filteredColumns = columns.map((col) => ({
    ...col,
    cards: col.cards.filter((card: ICard) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // onDragEnd handles both column and card drags
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
  
    if (type === "COLUMN") {
      // --- COLUMN REORDERING ---
      const newColumns = Array.from(columns);
      const [moved] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, moved);
      
      newColumns.forEach((col, index) => {
        col.order = index;
      });
      setColumns(newColumns);
      
      try {
        await updateColumnOrder(
          board._id,
          newColumns.map((col) => ({ id: col._id, order: col.order ?? 0 }))
        );
      } catch (err) {
        console.error("Failed to update column order", err);
      }
    } else if (type === "CARD") {
      // --- CARD REORDERING ---
      const sourceColIndex = columns.findIndex(
        (col) => col._id === source.droppableId
      );
      const destColIndex = columns.findIndex(
        (col) => col._id === destination.droppableId
      );
      if (sourceColIndex === -1 || destColIndex === -1) return;
      
      const sourceColumn = columns[sourceColIndex];
      const destColumn = columns[destColIndex];
      const sourceCards = Array.from(sourceColumn.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      
      if (source.droppableId === destination.droppableId) {
        sourceCards.splice(destination.index, 0, movedCard);
        sourceCards.forEach((card, index) => {
          card.order = index;
        });
        const newColumns = [...columns];
        newColumns[sourceColIndex] = { ...sourceColumn, cards: sourceCards };
        setColumns(newColumns);
        
        try {
          await updateCardOrder(
            sourceColumn._id,
            sourceCards.map((card) => ({ id: card._id, order: card.order ?? 0 }))
          );
        } catch (err) {
          console.error("Failed to update card order", err);
        }
      } else {
        const destCards = Array.from(destColumn.cards);
        destCards.splice(destination.index, 0, movedCard);
        sourceCards.forEach((card, index) => {
          card.order = index;
        });
        destCards.forEach((card, index) => {
          card.order = index;
        });
        movedCard.columnId = destColumn._id;
        
        const newColumns = [...columns];
        newColumns[sourceColIndex] = { ...sourceColumn, cards: sourceCards };
        newColumns[destColIndex] = { ...destColumn, cards: destCards };
        setColumns(newColumns);
        
        try {
          await updateCardOrder(
            sourceColumn._id,
            sourceCards.map((card) => ({ id: card._id, order: card.order ?? 0 }))
          );
          await updateCardOrder(
            destColumn._id,
            destCards.map((card) => ({ id: card._id, order: card.order ?? 0 }))
          );
          await updateCard(movedCard._id, {
            newColumnId: destColumn._id,
            order: movedCard.order ?? 0,
          });
        } catch (err) {
          console.error("Failed to update card order across columns", err);
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 text-white">Board: {board.name}</h1>
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="columns-droppable"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div className="flex flex-wrap gap-4">
                {filteredColumns.map((col, index) => (
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
                          setCardsForColumn={setCardsForColumn}
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
