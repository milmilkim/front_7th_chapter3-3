import { useQuery } from "@tanstack/react-query"
import { userApi } from "../api"

export const useUserDetail = (userId: number | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null
      return await userApi.fetchUser(userId)
    },
    enabled: !!userId,
  })
}
