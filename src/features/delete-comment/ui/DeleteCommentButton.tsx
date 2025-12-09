import { Trash2 } from "lucide-react"
import { Button } from "../../../components"

interface DeleteCommentButtonProps {
  commentId: number
  postId: number
  onDelete: (id: number, postId: number) => void
}

export const DeleteCommentButton = ({ commentId, postId, onDelete }: DeleteCommentButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={() => onDelete(commentId, postId)}>
      <Trash2 className="w-3 h-3" />
    </Button>
  )
}
