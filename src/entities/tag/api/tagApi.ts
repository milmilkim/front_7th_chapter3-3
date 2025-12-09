import type { Tag } from '../types'

export const tagApi = {
  // 태그 목록 조회
  async fetchTags(): Promise<Tag[]> {
    const response = await fetch('/api/posts/tags')
    return response.json()
  },
}
