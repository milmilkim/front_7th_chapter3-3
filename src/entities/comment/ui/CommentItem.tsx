import { ThumbsUp } from "lucide-react"
import type { Comment } from "../types"

interface CommentItemProps {
  comment: Comment
  onLike?: () => void
  showLikeButton?: boolean
}

export const CommentItem = ({ comment, onLike, showLikeButton = true }: CommentItemProps) => {
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.username || comment.id}`
  
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      {/* 댓글 내용 */}
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          {comment.user && (
            <>
              <img
                src={avatarUrl}
                alt={comment.user.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-sm">{comment.user.username}</span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-700">{comment.body}</p>
      </div>

      {/* 좋아요 버튼 */}
      {showLikeButton && (
        <button
          onClick={onLike}
          className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{comment.likes || 0}</span>
        </button>
      )}
    </div>
  )
}
