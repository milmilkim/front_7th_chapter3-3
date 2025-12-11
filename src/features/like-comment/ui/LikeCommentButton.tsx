import { ThumbsUp } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useLikeComment } from "../../../entities/comment"

interface LikeCommentButtonProps {
  commentId: number
  postId: number
  likes: number
}

export const LikeCommentButton = ({ commentId, postId, likes }: LikeCommentButtonProps) => {
  const likeCommentMutation = useLikeComment()

  const handleLike = async () => {
    await likeCommentMutation.mutateAsync({ id: commentId, likes: likes + 1, postId })
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{likes}</span>
    </Button>
  )
}
