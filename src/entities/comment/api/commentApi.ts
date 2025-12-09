import type { Comment, CommentsResponse, CreateCommentDto, UpdateCommentDto } from '../types'

export const commentApi = {
  // 게시물의 댓글 조회
  async fetchComments(postId: number): Promise<CommentsResponse> {
    const response = await fetch(`/api/comments/post/${postId}`)
    return response.json()
  },

  // 댓글 생성
  async createComment(data: CreateCommentDto): Promise<Comment> {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 댓글 수정
  async updateComment(id: number, data: UpdateCommentDto): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 댓글 삭제
  async deleteComment(id: number): Promise<void> {
    await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    })
  },

  // 댓글 좋아요
  async likeComment(id: number, currentLikes: number): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: currentLikes + 1 }),
    })
    return response.json()
  },
}
