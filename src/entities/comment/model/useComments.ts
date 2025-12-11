import { useQuery } from "@tanstack/react-query"
import { commentApi } from "../api"

// 댓글 목록 조회
export const useComments = (postId: number, enabled = true) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const data = await commentApi.fetchComments(postId)
      return data.comments
    },
    enabled,
  })
}
