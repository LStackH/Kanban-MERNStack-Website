import { IColumn } from "../types/kanbanTypes";

interface ColumnItemProps {
  column: IColumn;
}

export function ColumnItem({ column }: ColumnItemProps) {
  return (
    <div className="bg-gray-600 p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-2">{column.name}</h2>
      <p className="text-sm text-white-600">
        Cards: {column.cards.length}
      </p>
      {/* TODo: list cards, add card, etc. */}
    </div>
  );
}