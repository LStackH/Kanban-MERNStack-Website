// ---- Centralized HUB for the different types used in the frontend ----

export interface IComment {
  _id: string;
  text: string;
  cardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICard {
  _id: string;
  title: string;
  description: string;
  columnId: string;
  order?: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IColumn {
  _id: string;
  name: string;
  boardId: string;
  cards: ICard[];
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBoard {
  _id: string;
  name: string;
  columns: IColumn[];
}
