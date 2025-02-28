import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IBoard } from "../types/kanbanTypes";
import { getSingleBoard } from "../api/boardApi";
import { CreateBoard } from "../components/CreateBoard";
import { BoardView } from "../components/BoardView";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";

function BoardPage() {
  const [board, setBoard] = useState<IBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { searchQuery } = useSearch();
  const { token } = useAuth();

  // If not logged in, display a landing page
  if (!token) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to MyKanban</h2>
        <p className="mb-4">
          MyKanban is a simple Kanban board, that will allow you to create and organise lists, tasks and notes. 
        </p>
        <p className="mb-4"> 
          Start by registering or logging in, to create and see your board!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  // Fetch board data if logged in
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

  function handleBoardCreated(newBoard: IBoard) {
    setBoard(newBoard);
  }

  if (loading) return <div className="p-4">Loading board...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!board) return <CreateBoard onCreated={handleBoardCreated} />;

  return (
    <BoardView board={board} searchQuery={searchQuery} />
  );
}

export default BoardPage;