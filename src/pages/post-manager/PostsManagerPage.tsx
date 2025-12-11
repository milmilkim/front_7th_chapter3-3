import { useState } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import type { Post } from "../../entities/post"
import type { Comment } from "../../entities/comment"
import type { User } from "../../entities/user"
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
import { highlightText } from "../../shared/lib"
import { useQueryParams } from "../../shared/hooks"
import { usePosts, useSearchPosts, usePostsByTag, useAddPost, useUpdatePost, useDeletePost } from "../../entities/post"
import { useTags } from "../../entities/tag"
import { useComments, useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from "../../entities/comment"
import { useUserDetail } from "../../entities/user"

const PostsManager = () => {
  const { openModal, closeModal, isModalOpen } = useUIStore()

  // URL 파라미터 관리
  const queryParams = useQueryParams()
  const { skip, limit, searchQuery, selectedTag, sortBy, sortOrder, updateURL, setParams } = queryParams

  // 로컬 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [currentPostId, setCurrentPostId] = useState<number>(0)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [localSelectedTag, setLocalSelectedTag] = useState(selectedTag)

  // TanStack Query 훅들
  const { data: tagsData } = useTags()

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

  // 댓글 조회
  const { data: comments = [] } = useComments(selectedPost?.id || 0, !!selectedPost)

  // 사용자 상세
  const { data: selectedUser } = useUserDetail(selectedUserId)

  // Mutations
  const addPostMutation = useAddPost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const addCommentMutation = useAddComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  // 핸들러들
  const handleAddPost = async (data: { title: string; body: string; userId: number }) => {
    await addPostMutation.mutateAsync(data)
    closeModal("addPost")
  }

  const handleUpdatePost = async (id: number, data: { title: string; body: string }) => {
    await updatePostMutation.mutateAsync({ id, data })
    closeModal("editPost")
  }

  const handleDeletePost = async (id: number) => {
    await deletePostMutation.mutateAsync(id)
  }

  const handleAddComment = async (data: { body: string; postId: number; userId: number }) => {
    await addCommentMutation.mutateAsync(data)
    closeModal("addComment")
  }

  const handleUpdateComment = async (id: number, body: string) => {
    if (!selectedComment) return
    await updateCommentMutation.mutateAsync({ id, body, postId: selectedComment.postId })
    closeModal("editComment")
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    await deleteCommentMutation.mutateAsync({ id, postId })
  }

  const handleLikeComment = async (id: number, postId: number) => {
    const comment = comments.find((c) => c.id === id)
    if (!comment) return
    await likeCommentMutation.mutateAsync({ id, likes: comment.likes + 1, postId })
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    openModal("postDetail")
  }

  const openUserModal = (user: User) => {
    setSelectedUserId(user.id)
    openModal("userModal")
  }

  const handleSearchSubmit = () => {
    setParams({ ...queryParams, searchQuery: localSearchQuery, skip: 0 })
    updateURL({ searchQuery: localSearchQuery, skip: 0 })
  }

  const handleTagChange = (tag: string) => {
    setLocalSelectedTag(tag)
    setParams({ ...queryParams, selectedTag: tag, skip: 0 })
    updateURL({ selectedTag: tag, skip: 0 })
  }

  const handleTagClick = (tag: string) => {
    setLocalSelectedTag(tag)
    updateURL({ selectedTag: tag })
  }

  const handleLimitChange = (newLimit: number) => {
    setParams({ ...queryParams, limit: newLimit, skip: 0 })
    updateURL({ limit: newLimit, skip: 0 })
  }

  const handlePrevious = () => {
    const newSkip = Math.max(0, skip - limit)
    setParams({ ...queryParams, skip: newSkip })
    updateURL({ skip: newSkip })
  }

  const handleNext = () => {
    const newSkip = skip + limit
    setParams({ ...queryParams, skip: newSkip })
    updateURL({ skip: newSkip })
  }

  const handleSortByChange = (newSortBy: string) => {
    setParams({ ...queryParams, sortBy: newSortBy })
    updateURL({ sortBy: newSortBy })
  }

  const handleSortOrderChange = (newSortOrder: string) => {
    setParams({ ...queryParams, sortOrder: newSortOrder })
    updateURL({ sortOrder: newSortOrder })
  }

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
          <PostFilters
            searchQuery={localSearchQuery}
            selectedTag={localSelectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tagsData || []}
            onSearchChange={setLocalSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onTagChange={handleTagChange}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
          />

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
              onPostDetail={openPostDetail}
              onEditPost={(post) => {
                setSelectedPost(post)
                openModal("editPost")
              }}
              onDeletePost={handleDeletePost}
              onUserClick={openUserModal}
              highlightText={highlightText}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            skip={skip}
            limit={limit}
            total={total}
            onLimitChange={handleLimitChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </CardContent>

      {/* 다이얼로그들 */}
      <AddPostDialog
        open={isModalOpen("addPost")}
        onOpenChange={(open) => !open && closeModal("addPost")}
        onSubmit={handleAddPost}
      />

      <EditPostDialog
        open={isModalOpen("editPost")}
        onOpenChange={(open) => !open && closeModal("editPost")}
        post={selectedPost}
        onSubmit={handleUpdatePost}
      />

      <AddCommentDialog
        open={isModalOpen("addComment")}
        onOpenChange={(open) => !open && closeModal("addComment")}
        postId={currentPostId}
        onSubmit={handleAddComment}
      />

      <EditCommentDialog
        open={isModalOpen("editComment")}
        onOpenChange={(open) => !open && closeModal("editComment")}
        comment={selectedComment}
        onSubmit={handleUpdateComment}
      />

      <PostDetailDialog
        open={isModalOpen("postDetail")}
        onOpenChange={(open) => !open && closeModal("postDetail")}
        post={selectedPost}
        comments={comments}
        searchQuery={searchQuery}
        onAddComment={(postId) => {
          setCurrentPostId(postId)
          openModal("addComment")
        }}
        onEditComment={(comment) => {
          setSelectedComment(comment)
          openModal("editComment")
        }}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
        highlightText={highlightText}
      />

      <UserModal
        open={isModalOpen("userModal")}
        onOpenChange={(open) => !open && closeModal("userModal")}
        user={selectedUser}
      />
    </Card>
  )
}

export default PostsManager
