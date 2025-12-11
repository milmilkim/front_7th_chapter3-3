import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "../../../entities/post/api"
import { userApi } from "../../../entities/user/api"
import type { PostsResponse } from "../../../entities/post"

export const useAddPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { title: string; body: string; userId: number }) => {
      const newPost = await postApi.createPost(data)
      const author = await userApi.fetchUser(data.userId)
      return { ...newPost, author }
    },
    onMutate: (data) => {
      // 낙관적 업데이트: 캐시 바로 수정
      queryClient.setQueriesData(
        {
          queryKey: ["posts"],
          predicate: (query) => {
            const params = query.queryKey[1] as { skip: number; limit: number } | undefined
            return params?.skip === 0
          },
        },
        (old: PostsResponse | undefined) => {
          if (!old) return old
          
          const tempPost = {
            id: old.total + 1,
            title: data.title,
            body: data.body,
            userId: data.userId,
            tags: [],
            reactions: { likes: 0, dislikes: 0 },
            views: 0,
            author: undefined,
          }

          return {
            ...old,
            posts: [tempPost, ...old.posts],
            total: old.total + 1,
          }
        }
      )
    },
    onSuccess: (newPost) => {
      // 실제 서버 응답으로 교체
      queryClient.setQueriesData(
        {
          queryKey: ["posts"],
          predicate: (query) => {
            const params = query.queryKey[1] as { skip: number; limit: number } | undefined
            return params?.skip === 0
          },
        },
        (old: PostsResponse | undefined) => {
          if (!old) return old
          return {
            ...old,
            posts: old.posts.map((post, index) => (index === 0 ? newPost : post)),
          }
        }
      )
    },
  })
}
