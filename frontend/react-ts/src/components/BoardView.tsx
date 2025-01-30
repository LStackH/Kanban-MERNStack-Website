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

  // Zoom state (1 = 100%, 0.9 = 90%, etc.)
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

  // Zoom controls
  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + 0.1, 1.0)); // don't go above 100%
  }
  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - 0.1, 0.1)); // don't go below 10%
  }
  function handleResetZoom() {
    setZoom(1);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Board: {board.name}</h1>

      {/* CREATE COLUMN */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          className="border p-1"
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

      {/* ZOOM CONTROLS */}
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
        <span className="ml-2">Zoom: {Math.round(zoom * 100)}%</span>
      </div>

      {/* WRAPPING COLUMNS WITH ZOOM */}
      <div
        className="origin-center" // ensures scaling from center
        style={{
          transform: `scale(${zoom})`,
        }}
      >
        {/* flex-wrap ensures new row is created if there's no horizontal space left. */}
        <div className="flex flex-wrap gap-4">
          {columns.map((col) => (
            <div
              key={col._id}
              // fixed width so columns maintain size, forcing wrap
              className="w-64 bg-gray-200 p-4 rounded shadow"
            >
              <ColumnItem column={col} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
