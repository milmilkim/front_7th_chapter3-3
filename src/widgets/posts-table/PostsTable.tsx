import { Edit2, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui"
import { DeletePostButton } from "../../features/delete-post"
import type { Post } from "../../entities/post"
import { useUIStore, usePostsStore } from "../../app/store"
import { useQueryParams } from "../../shared/hooks"
import { highlightText } from "../../shared/lib"

interface PostsTableProps {
  posts: Post[]
}

export const PostsTable = ({ posts }: PostsTableProps) => {
  const { openModal } = useUIStore()
  const { setSelectedPost, setSelectedUserId } = usePostsStore()
  const { searchQuery, selectedTag, updateURL } = useQueryParams()

  const handleTagClick = (tag: string) => {
    updateURL({ selectedTag: tag })
  }

  const handlePostDetail = (post: Post) => {
    setSelectedPost(post)
    openModal("postDetail")
  }

  const handleEditPost = (post: Post) => {
    setSelectedPost(post)
    openModal("editPost")
  }

  const handleUserClick = (author: { id: number; username: string; image: string }) => {
    setSelectedUserId(author.id)
    openModal("userModal")
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {post.author && (
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleUserClick(post.author!)}
                >
                  <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author.username}</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handlePostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <DeletePostButton postId={post.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
