import type { Tag } from '../types'
import { getApiUrl } from '../../../shared/lib'

export const tagApi = {
  // 태그 목록 조회
  async fetchTags(): Promise<Tag[]> {
    const response = await fetch(getApiUrl('/posts/tags'))
    return response.json()
  },
}
