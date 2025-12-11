import type { Comment, CommentsResponse, CreateCommentDto, UpdateCommentDto } from '../types'
import { getApiUrl } from '../../../shared/lib'

export const commentApi = {
  // 게시물의 댓글 조회
  async fetchComments(postId: number): Promise<CommentsResponse> {
    const response = await fetch(getApiUrl(`/comments/post/${postId}`))
    if (!response.ok) {
      return { comments: [], total: 0, skip: 0, limit: 0 }
    }
    return response.json()
  },

  // 댓글 생성
  async createComment(data: CreateCommentDto): Promise<Comment> {
    const response = await fetch(getApiUrl('/comments/add'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '댓글 생성에 실패했습니다.')
    }
    return response.json()
  },

  // 댓글 수정
  async updateComment(id: number, data: UpdateCommentDto): Promise<Comment> {
    const response = await fetch(getApiUrl(`/comments/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '댓글 수정에 실패했습니다.')
    }
    return response.json()
  },

  // 댓글 삭제
  async deleteComment(id: number): Promise<void> {
    const response = await fetch(getApiUrl(`/comments/${id}`), {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '댓글 삭제에 실패했습니다.')
    }
  },

  // 댓글 좋아요
  async likeComment(id: number, currentLikes: number): Promise<Comment> {
    const response = await fetch(getApiUrl(`/comments/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: currentLikes + 1 }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '좋아요에 실패했습니다.')
    }
    return response.json()
  },
}
