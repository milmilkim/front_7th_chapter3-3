import { Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useDeletePost } from "../../../entities/post"

interface DeletePostButtonProps {
  postId: number
}

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const deletePostMutation = useDeletePost()

  const handleDelete = () => {
    deletePostMutation.mutate(postId, {
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : "게시물 삭제에 실패했습니다."
        alert(errorMessage)
      },
    })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
