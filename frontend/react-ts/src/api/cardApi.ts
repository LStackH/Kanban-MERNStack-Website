// API hub for card api calls

import { axiosInstance } from "./axiosConfig";
import { ICard } from "../types/kanbanTypes";

interface CreateCardPayload {
  columnId: string;
  title: string;
  description?: string;
}

interface UpdateCardPayload extends Partial<ICard> {
  newColumnId?: string;
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
  payload: UpdateCardPayload
): Promise<ICard> {
  const response = await axiosInstance.put(`/cards/${cardId}`, payload);
  return response.data.card;
}

export async function updateCardOrder(
  columnId: string,
  cards: { id: string; order: number }[]
): Promise<ICard[]> {
  const response = await axiosInstance.put(`/cards/order/${columnId}`, {
    cards,
  });
  return response.data.message;
}

export async function deleteCard(cardId: string): Promise<void> {
  await axiosInstance.delete(`/cards/${cardId}`);
}
