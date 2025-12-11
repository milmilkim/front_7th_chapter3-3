import { Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useDeletePost } from "../../../entities/post"

interface DeletePostButtonProps {
  postId: number
}

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const deletePostMutation = useDeletePost()

  const handleDelete = async () => {
    await deletePostMutation.mutateAsync(postId)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
