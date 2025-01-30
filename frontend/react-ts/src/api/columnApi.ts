// API hub for column api calls

import { axiosInstance } from "./axiosConfig";
import { IColumn } from "../types/kanbanTypes";

interface CreateColumnPayload {
  boardId: string;
  name: string;
}

export async function createColumn(
  boardId: string,
  name: string
): Promise<IColumn> {
  const response = await axiosInstance.post("/columns", {
    boardId,
    name,
  } as CreateColumnPayload);
  return response.data.column;
}
