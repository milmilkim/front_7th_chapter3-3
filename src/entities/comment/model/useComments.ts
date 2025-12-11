import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../api"
import type { Comment } from "../types"

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

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { body: string; postId: number; userId: number }) => {
      return await commentApi.createComment(data)
    },
    onMutate: (variables) => {
      // 낙관적 업데이트: 임시 댓글 추가
      const tempComment = {
        id: -Date.now(),
        body: variables.body,
        postId: variables.postId,
        likes: 0,
        user: undefined,
      }
      
      queryClient.setQueryData(["comments", variables.postId], (old: Comment[] | undefined) => {
        if (!old) return [tempComment]
        return [...old, tempComment]
      })
    },
    onSuccess: (newComment, variables) => {
      queryClient.setQueryData(["comments", variables.postId], (old: Comment[] | undefined) => {
        if (!old || old.length === 0) return old
        
        const commentWithLikes = { ...newComment, likes: newComment.likes || 0 }
        const newComments = [...old]
        newComments[newComments.length - 1] = commentWithLikes
        
        return newComments
      })
    },
  })
}

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; index: number; body: string; postId: number }) => {
      return await commentApi.updateComment(id, { body })
    },
    onMutate: (variables) => {
      queryClient.setQueryData(["comments", variables.postId], (old: Comment[] | undefined) => {
        if (!old) return old
        return old.map((comment, idx) =>
          idx === variables.index ? { ...comment, body: variables.body } : comment
        )
      })
    },
  })
}

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; index: number; postId: number }) => {
      await commentApi.deleteComment(id)
      return { id, postId }
    },
    onMutate: (variables) => {
      queryClient.setQueryData(["comments", variables.postId], (old: Comment[] | undefined) => {
        if (!old) return old
        return old.filter((_, idx) => idx !== variables.index)
      })
    },
  })
}

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, likes }: { id: number; index: number; likes: number; postId: number }) => {
      return await commentApi.likeComment(id, likes)
    },
    onMutate: (variables) => {
      queryClient.setQueryData(["comments", variables.postId], (old: Comment[] | undefined) => {
        if (!old) return old
        return old.map((comment, idx) =>
          idx === variables.index ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
        )
      })
    },
  })
}
