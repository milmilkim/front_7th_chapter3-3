import { ThumbsUp } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useLikeComment } from "../model/useLikeComment"

interface LikeCommentButtonProps {
  commentId: number
  commentIndex: number
  postId: number
  likes: number
}

export const LikeCommentButton = ({ commentId, commentIndex, postId, likes }: LikeCommentButtonProps) => {
  const likeCommentMutation = useLikeComment()

  const handleLike = () => {
    const currentLikes = likes || 0
    likeCommentMutation.mutate(
      { id: commentId, index: commentIndex, likes: currentLikes + 1, postId },
      {
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : "좋아요에 실패했습니다."
          alert(errorMessage)
        },
      }
    )
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike}>
      <ThumbsUp className="w-3 h-3" />
      <span className="ml-1 text-xs">{likes || 0}</span>
    </Button>
  )
}
