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

export async function updateColumn(
  columnId: string,
  payload: Partial<IColumn>
): Promise<IColumn> {
  const response = await axiosInstance.put(`/columns/${columnId}`, payload);
  return response.data.column;
}

export async function updateColumnOrder(
  boardId: string,
  columns: { id: string; order: number }[]
): Promise<IColumn[]> {
  const response = await axiosInstance.put(`/columns/order/${boardId}`, {
    columns,
  });
  return response.data.message;
}

export async function deleteColumn(columnId: string): Promise<void> {
  await axiosInstance.delete(`/columns/${columnId}`);
}
