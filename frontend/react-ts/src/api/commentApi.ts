import { axiosInstance } from "./axiosConfig";
import { IComment } from "../types/kanbanTypes";

interface CreateCommentPayload {
  cardId: string;
  text: string;
}

export async function createComment(
  cardId: string,
  text: string
): Promise<IComment> {
  const response = await axiosInstance.post("/comments", {
    cardId,
    text,
  } as CreateCommentPayload);
  return response.data.comment;
}

export async function updateComment(
  commentId: string,
  payload: Partial<IComment>
): Promise<IComment> {
  const response = await axiosInstance.put(`/comments/${commentId}`, payload);
  return response.data.comment;
}

export async function deleteComment(commentId: string): Promise<void> {
  await axiosInstance.delete(`/comments/${commentId}`);
}
