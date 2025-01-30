
import { useEffect, useState } from "react";
import { IBoard } from "../types/kanbanTypes";
import { getSingleBoard } from "../api/boardApi";
import { CreateBoard } from "../components/CreateBoard";
import { BoardView } from "../components/BoardView";

function BoardPage() {
  const [board, setBoard] = useState<IBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch board on mount
  useEffect(() => {
    async function fetchBoard() {
      try {
        const fetchedBoard = await getSingleBoard();
        if (fetchedBoard) {
          setBoard(fetchedBoard);
        }
      } catch (err) {
        setError("Failed to fetch board");
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, []);

  // Callback after successfully creating a new board
  function handleBoardCreated(newBoard: IBoard) {
    setBoard(newBoard);
  }

  if (loading) {
    return <div className="p-4">Loading board...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // If no board, show create option
  if (!board) {
    return <CreateBoard onCreated={handleBoardCreated} />;
  }

  // Otherwise show the board
  return <BoardView board={board} />;
}


export default BoardPage