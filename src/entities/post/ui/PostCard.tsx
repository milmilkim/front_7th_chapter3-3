import { ThumbsUp, ThumbsDown } from "lucide-react"
import type { Post } from "../types"

interface PostCardProps {
  post: Post
  onTagClick?: (tag: string) => void
  onUserClick?: (author: { id: number; username: string; image: string }) => void
  highlightText?: (text: string) => React.ReactNode
  selectedTag?: string
}

export const PostCard = ({ post, onTagClick, onUserClick, highlightText, selectedTag }: PostCardProps) => {
  return (
    <div className="space-y-2">
      {/* 제목 */}
      <div className="font-medium">
        {highlightText ? highlightText(post.title) : post.title}
      </div>

      {/* 태그 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={`px-1 text-[9px] font-semibold rounded-[4px] ${
                onTagClick ? "cursor-pointer" : ""
              } ${
                selectedTag === tag
                  ? "text-white bg-blue-500 hover:bg-blue-600"
                  : "text-blue-800 bg-blue-100 hover:bg-blue-200"
              }`}
              onClick={() => onTagClick?.(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 작성자 */}
      {post.author && (
        <div
          className={`flex items-center space-x-2 ${onUserClick ? "cursor-pointer" : ""}`}
          onClick={() => onUserClick?.(post.author!)}
        >
          <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
          <span className="text-sm">{post.author.username}</span>
        </div>
      )}

      {/* 반응 */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </div>
    </div>
  )
}
