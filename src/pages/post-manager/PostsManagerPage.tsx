import { useMemo } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import { useUIStore } from "../../shared/store"
import { AddPostDialog } from "../../features/add-post"
import { EditPostDialog } from "../../features/edit-post"
import { AddCommentDialog } from "../../features/add-comment"
import { EditCommentDialog } from "../../features/edit-comment"
import { PostsTable } from "../../widgets/posts-table"
import { PostFilters } from "../../widgets/post-filters"
import { Pagination } from "../../widgets/pagination"
import { PostDetailDialog } from "../../widgets/post-detail"
import { UserModal } from "../../widgets/user-modal"
import { useQueryParams } from "../../shared/hooks"
import { usePosts, useSearchPosts, usePostsByTag } from "../../entities/post"

const PostsManager = () => {
  const { openModal } = useUIStore()

  // URL 파라미터 관리
  const { skip, limit, searchQuery, selectedTag, sortBy, sortOrder } = useQueryParams()

  // 게시물 조회 (조건부)
  const postsQuery = usePosts({ limit, skip })
  const searchPostsQuery = useSearchPosts(searchQuery)
  const tagQuery = usePostsByTag(selectedTag)

  // 현재 활성화된 쿼리 데이터 선택
  let currentPostsData
  let isLoading

  if (searchQuery) {
    currentPostsData = searchPostsQuery.data
    isLoading = searchPostsQuery.isLoading
  } else if (selectedTag) {
    currentPostsData = tagQuery.data
    isLoading = tagQuery.isLoading
  } else {
    currentPostsData = postsQuery.data
    isLoading = postsQuery.isLoading
  }

  const posts = currentPostsData?.posts || []
  const total = currentPostsData?.total || 0

  // 정렬 로직
  const sortedPosts = useMemo(() => {
    if (!sortBy || sortBy === "none") return posts

    const sorted = [...posts]

    switch (sortBy) {
      case "id":
        sorted.sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id))
        break
      case "title":
        sorted.sort((a, b) =>
          sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        )
        break
      case "reactions":
        sorted.sort((a, b) => {
          const aLikes = a.reactions?.likes || 0
          const bLikes = b.reactions?.likes || 0
          return sortOrder === "asc" ? aLikes - bLikes : bLikes - aLikes
        })
        break
    }

    return sorted
  }, [posts, sortBy, sortOrder])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => openModal("addPost")}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 */}
          <PostFilters />

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable posts={sortedPosts} />
          )}

          {/* 페이지네이션 */}
          <Pagination total={total} />
        </div>
      </CardContent>

      {/* 다이얼로그들 */}
      <AddPostDialog />
      <EditPostDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <PostDetailDialog />
      <UserModal />
    </Card>
  )
}

export default PostsManager
