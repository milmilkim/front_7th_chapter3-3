import type { Post, PostsResponse, CreatePostDto, UpdatePostDto } from '../types'

export const postApi = {
  // 게시물 목록 조회
  async fetchPosts(params: { limit: number; skip: number }): Promise<PostsResponse> {
    const response = await fetch(`/api/posts?limit=${params.limit}&skip=${params.skip}`)
    return response.json()
  },

  // 게시물 검색
  async searchPosts(query: string): Promise<PostsResponse> {
    const response = await fetch(`/api/posts/search?q=${query}`)
    return response.json()
  },

  // 태그별 게시물 조회
  async fetchPostsByTag(tag: string): Promise<PostsResponse> {
    const response = await fetch(`/api/posts/tag/${tag}`)
    return response.json()
  },

  // 게시물 생성
  async createPost(data: CreatePostDto): Promise<Post> {
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 게시물 수정
  async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    })
  },
}
