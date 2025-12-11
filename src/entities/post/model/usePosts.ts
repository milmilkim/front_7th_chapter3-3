import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "../api"
import type { Post, PostsResponse } from "../types"
import { userApi } from "../../user/api"

// 게시물 목록 조회
export const usePosts = (params: { limit: number; skip: number }) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.fetchPosts(params),
        userApi.fetchUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      return {
        posts: postsWithUsers,
        total: postsData.total,
      }
    },
  })
}

// 게시물 검색
export const useSearchPosts = (searchQuery: string) => {
  return useQuery({
    queryKey: ["posts", "search", searchQuery],
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.searchPosts(searchQuery),
        userApi.fetchUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      return {
        posts: postsWithUsers,
        total: postsData.total,
      }
    },
    enabled: !!searchQuery,
  })
}

// 태그별 게시물 조회
export const usePostsByTag = (tag: string) => {
  return useQuery({
    queryKey: ["posts", "tag", tag],
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.fetchPostsByTag(tag),
        userApi.fetchUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      return {
        posts: postsWithUsers,
        total: postsData.total,
      }
    },
    enabled: !!tag && tag !== "all",
  })
}

// 게시물 추가
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

// 게시물 수정
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

// 게시물 삭제
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
