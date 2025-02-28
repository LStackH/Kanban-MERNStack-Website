import { IComment } from "../types/kanbanTypes";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: IComment[];
  onDeleteComment: (commentId: string) => void;
  onUpdateComment: (updatedComment: IComment) => void;
}

// CommentList, used to just list the CommentItem's
export function CommentList({
  comments,
  onDeleteComment,
  onUpdateComment,
}: CommentListProps) {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onDelete={onDeleteComment}
          onUpdate={onUpdateComment}
        />
      ))}
    </div>
  );
}
