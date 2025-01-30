import { useState } from "react";
import { createBoard } from "../api/boardApi";
import { IBoard } from "../types/kanbanTypes";

interface CreateBoardProps {
  onCreated: (board: IBoard) => void;
}

export function CreateBoard({ onCreated }: CreateBoardProps) {
  const [boardName, setBoardName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    setIsLoading(true);

    try {
      // If user typed nothing, default to "My New Board"
      const newBoard = await createBoard(boardName || "My New Board");
      onCreated(newBoard);
      setBoardName("");
    } catch (err: any) {
      setError("Failed to create board");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">No board found!</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        type="text"
        placeholder="Board Name"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        className="border p-1 mr-2"
      />
      <button
        onClick={handleCreate}
        disabled={isLoading}
        className="px-4 py-1 bg-blue-600 text-white"
      >
        {isLoading ? "Creating..." : "Create Board"}
      </button>
    </div>
  );
}