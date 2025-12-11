import * as React from "react"
import { Edit2, Plus } from "lucide-react"
import { Button } from "../../shared/ui"
import { DeleteCommentButton } from "../../features/delete-comment"
import { LikeCommentButton } from "../../features/like-comment"
import type { Comment } from "../../entities/comment"
import { useUIStore, usePostsStore } from "../../shared/store"
import { useQueryParams } from "../../shared/hooks"
import { highlightText as highlightTextUtil } from "../../shared/lib"

interface CommentsListProps {
  postId: number
  comments: Comment[]
}

export const CommentsList = ({ postId, comments }: CommentsListProps) => {
  const { openModal } = useUIStore()
  const { setSelectedComment, setCurrentPostId } = usePostsStore()
  const { searchQuery } = useQueryParams()

  const handleAddComment = () => {
    setCurrentPostId(postId)
    openModal("addComment")
  }

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    openModal("editComment")
  }
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user?.username}:</span>
              <span className="truncate">{highlightTextUtil(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LikeCommentButton commentId={comment.id} postId={postId} likes={comment.likes} />
              <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <DeleteCommentButton commentId={comment.id} postId={postId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
