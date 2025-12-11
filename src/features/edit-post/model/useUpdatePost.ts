import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "../../../entities/post/api"
import type { PostsResponse, Post } from "../../../entities/post"

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; body: string } }) => {
      return await postApi.updatePost(id, data)
    },
    onMutate: ({ id, data }) => {
      // 낙관적 업데이트: 캐시 바로 수정
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: PostsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map((post: Post) => (post.id === id ? { ...post, ...data } : post)),
        }
      })
    },
  })
}
