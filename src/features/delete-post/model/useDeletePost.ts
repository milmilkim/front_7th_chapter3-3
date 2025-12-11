import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "../../../entities/post/api"
import type { PostsResponse, Post } from "../../../entities/post"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await postApi.deletePost(id)
      return id
    },
    onMutate: (id) => {
      // 낙관적 업데이트: 캐시 바로 수정
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: PostsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.id !== id),
          total: old.total - 1,
        }
      })
    },
  })
}
