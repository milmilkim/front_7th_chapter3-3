import { Trash2 } from "lucide-react"
import { Button } from "../../../components"

interface DeletePostButtonProps {
  postId: number
  onDelete: (id: number) => void
}

export const DeletePostButton = ({ postId, onDelete }: DeletePostButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={() => onDelete(postId)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
