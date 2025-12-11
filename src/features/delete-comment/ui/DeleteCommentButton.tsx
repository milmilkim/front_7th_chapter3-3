import { Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useDeleteComment } from "../../../entities/comment"

interface DeleteCommentButtonProps {
  commentId: number
  commentIndex: number
  postId: number
}

export const DeleteCommentButton = ({ commentId, commentIndex, postId }: DeleteCommentButtonProps) => {
  const deleteCommentMutation = useDeleteComment()

  const handleDelete = () => {
    deleteCommentMutation.mutate(
      { id: commentId, index: commentIndex, postId },
      {
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : "댓글 삭제에 실패했습니다."
          alert(errorMessage)
        },
      }
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
