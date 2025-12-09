import { ThumbsUp } from "lucide-react"
import { Button } from "../../../shared/ui"

interface LikeCommentButtonProps {
  commentId: number
  postId: number
  likes: number
  onLike: (id: number, postId: number) => void
}

export const LikeCommentButton = ({ commentId, postId, likes, onLike }: LikeCommentButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={() => onLike(commentId, postId)}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{likes}</span>
    </Button>
  )
}
