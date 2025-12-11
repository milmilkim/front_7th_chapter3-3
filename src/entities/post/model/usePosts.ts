import { useQuery } from "@tanstack/react-query"
import { postApi } from "../api"
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
