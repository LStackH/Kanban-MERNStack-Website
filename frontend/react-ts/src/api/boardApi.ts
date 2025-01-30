import { axiosInstance } from "./axiosConfig";
import { IBoard } from "../types/kanbanTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function getSingleBoard(): Promise<IBoard | null> {
  const res = await axiosInstance.get(`${API_URL}/boards`);
  const boards = res.data.boards;
  if (!Array.isArray(boards) || boards.length === 0) {
    return null;
  }
  return boards[0];
}

export async function createBoard(name: string): Promise<IBoard> {
  const response = await axiosInstance.post(`${API_URL}/boards`, { name });
  return response.data.board;
}
