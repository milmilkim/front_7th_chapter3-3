import * as React from "react"
import { Edit2, Plus } from "lucide-react"
import { Button } from "../../shared/ui"
import { DeleteCommentButton } from "../../features/delete-comment"
import { LikeCommentButton } from "../../features/like-comment"
import type { Comment } from "../../entities/comment"

interface CommentsListProps {
  postId: number
  comments: Comment[]
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number, postId: number) => void
  highlightText: (text: string, highlight: string) => React.ReactElement | null
}

export const CommentsList = ({
  postId,
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  highlightText,
}: CommentsListProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => onAddComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user?.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LikeCommentButton commentId={comment.id} postId={postId} likes={comment.likes} onLike={onLikeComment} />
              <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <DeleteCommentButton commentId={comment.id} postId={postId} onDelete={onDeleteComment} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
