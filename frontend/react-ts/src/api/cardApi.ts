import { axiosInstance } from "./axiosConfig";
import { ICard } from "../types/kanbanTypes";

interface CreateCardPayload {
  columnId: string;
  title: string;
  description?: string;
}

export async function createCard(
  columnId: string,
  title: string,
  description?: string
): Promise<ICard> {
  const response = await axiosInstance.post("/cards", {
    columnId,
    title,
    description: description || "",
  } as CreateCardPayload);
  return response.data.card;
}

export async function updateCard(
  cardId: string,
  payload: Partial<ICard>
): Promise<ICard> {
  const response = await axiosInstance.put(`/cards/${cardId}`, payload);
  return response.data.card;
}

export async function deleteCard(cardId: string): Promise<void> {
  await axiosInstance.delete(`/cards/${cardId}`);
}
