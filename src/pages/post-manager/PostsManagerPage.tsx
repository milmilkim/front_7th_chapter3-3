import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import { postApi } from "../../entities/post"
import { commentApi } from "../../entities/comment"
import { userApi } from "../../entities/user"
import { tagApi } from "../../entities/tag"
import type { Post } from "../../entities/post"
import type { Comment } from "../../entities/comment"
import type { User } from "../../entities/user"
import type { Tag } from "../../entities/tag"
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

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // Zustand UI Store
  const { openModal, closeModal, isModalOpen } = useUIStore()

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPostId, setCurrentPostId] = useState<number>(0)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const postsData = await postApi.fetchPosts({ limit, skip })
      const usersData = await userApi.fetchUsers({ limit: 0, select: "username,image" })

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await postApi.searchPosts(searchQuery)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        postApi.fetchPostsByTag(tag),
        userApi.fetchUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const data = await tagApi.fetchTags()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 추가
  const handleAddPost = async (data: { title: string; body: string; userId: number }) => {
    try {
      const newPost = await postApi.createPost(data)
      setPosts([newPost, ...posts])
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 수정
  const handleUpdatePost = async (id: number, data: { title: string; body: string }) => {
    try {
      const updatedPost = await postApi.updatePost(id, data)
      setPosts(posts.map((post) => (post.id === id ? { ...post, ...updatedPost } : post)))
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const handleDeletePost = async (id: number) => {
    try {
      await postApi.deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return
    try {
      const data = await commentApi.fetchComments(postId)
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const handleAddComment = async (data: { body: string; postId: number; userId: number }) => {
    try {
      const newComment = await commentApi.createComment(data)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), newComment],
      }))
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 수정
  const handleUpdateComment = async (id: number, body: string) => {
    if (!selectedComment) return
    try {
      const updatedComment = await commentApi.updateComment(id, { body })
      setComments((prev) => ({
        ...prev,
        [selectedComment.postId]: prev[selectedComment.postId].map((comment) =>
          comment.id === id ? { ...comment, ...updatedComment } : comment
        ),
      }))
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await commentApi.deleteComment(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const handleLikeComment = async (id: number, postId: number) => {
    try {
      const comment = comments[postId]?.find((c) => c.id === id)
      if (!comment) return

      const updatedComment = await commentApi.likeComment(id, comment.likes)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) => (c.id === id ? { ...updatedComment, likes: comment.likes + 1 } : c)),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    openModal("postDetail")
  }

  // 사용자 모달 열기
  const openUserModal = async (user: any) => {
    try {
      const userData = await userApi.fetchUser(user.id)
      setSelectedUser(userData)
      openModal("userModal")
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 하이라이트 함수
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

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
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSearchSubmit={searchPosts}
            onTagChange={(tag) => {
              setSelectedTag(tag)
              fetchPostsByTag(tag)
            }}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagClick={(tag) => {
                setSelectedTag(tag)
                updateURL()
              }}
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
            onLimitChange={setLimit}
            onPrevious={() => setSkip(Math.max(0, skip - limit))}
            onNext={() => setSkip(skip + limit)}
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
        comments={selectedPost ? comments[selectedPost.id] || [] : []}
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
