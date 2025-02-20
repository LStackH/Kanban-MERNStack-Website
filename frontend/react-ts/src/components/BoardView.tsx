import { useState } from "react";
import { IBoard, IColumn } from "../types/kanbanTypes";
import { createColumn } from "../api/columnApi";
import { ColumnItem } from "./ColumnItem";

interface BoardViewProps {
  board: IBoard;
}

export function BoardView({ board }: BoardViewProps) {
  const [columns, setColumns] = useState<IColumn[]>(board.columns);
  const [newColName, setNewColName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

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

  // Callback to remove a deleted column from state
  function handleDeleteColumn(deletedColumnId: string) {
    setColumns((prev) => prev.filter((col) => col._id !== deletedColumnId));
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + 0.1, 1.0));
  }
  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  }
  function handleResetZoom() {
    setZoom(1);
  }

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

      {/* Zoom Controls */}
      <div className="mb-4 space-x-2">
        <button
          onClick={handleZoomOut}
          className="px-3 py-1 bg-gray-400 hover:bg-gray-500"
        >
          -
        </button>
        <button
          onClick={handleResetZoom}
          className="px-3 py-1 bg-gray-400 hover:bg-gray-500"
        >
          100%
        </button>
        <button
          onClick={handleZoomIn}
          className="px-3 py-1 bg-gray-400 hover:bg-gray-500"
        >
          +
        </button>
        <span className="ml-2 text-white">Zoom: {Math.round(zoom * 100)}%</span>
      </div>

      {/* Render Columns with wrapping and zoom */}
      <div className="origin-top-left" style={{ transform: `scale(${zoom})` }}>
        <div className="flex flex-wrap gap-4">
          {columns.map((col) => (
            <ColumnItem
              key={col._id}
              column={col}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
