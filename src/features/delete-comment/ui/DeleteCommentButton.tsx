import { Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useDeleteComment } from "../../../entities/comment"

interface DeleteCommentButtonProps {
  commentId: number
  postId: number
}

export const DeleteCommentButton = ({ commentId, postId }: DeleteCommentButtonProps) => {
  const deleteCommentMutation = useDeleteComment()

  const handleDelete = async () => {
    await deleteCommentMutation.mutateAsync({ id: commentId, postId })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
