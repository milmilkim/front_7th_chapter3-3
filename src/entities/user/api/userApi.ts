import type { User, UsersResponse } from '../types'

export const userApi = {
  // 사용자 목록 조회
  async fetchUsers(params?: { limit?: number; select?: string }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams()
    if (params?.limit !== undefined) queryParams.set('limit', params.limit.toString())
    if (params?.select) queryParams.set('select', params.select)

    const response = await fetch(`/api/users?${queryParams.toString()}`)
    return response.json()
  },

  // 특정 사용자 조회
  async fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },
}
