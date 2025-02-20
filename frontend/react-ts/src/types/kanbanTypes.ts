export interface ICard {
  _id: string;
  title: string;
  description: string;
  columnId: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IColumn {
  _id: string;
  name: string;
  boardId: string;
  cards: ICard[];
  // Possibly: order, createdAt, updatedAt
}

export interface IBoard {
  _id: string;
  name: string;
  columns: IColumn[];
  // Possibly: owner, createdAt, updatedAt
}
