import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { body: string; postId: number; userId: number }) => {
      return await commentApi.createComment(data)
    },
    onSuccess: (newComment, variables) => {
      // 캐시 직접 업데이트 (fake JSON이라 서버에 저장 안 됨)
      queryClient.setQueryData(["comments", variables.postId], (old: any) => {
        // likes 필드가 없으면 0으로 초기화
        const commentWithLikes = { ...newComment, likes: newComment.likes || 0 }
        if (!old) return [commentWithLikes]
        return [...old, commentWithLikes]
      })
    },
  })
}

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body, postId }: { id: number; body: string; postId: number }) => {
      return await commentApi.updateComment(id, { body })
    },
    onSuccess: (updatedComment, variables) => {
      // 캐시 직접 업데이트
      queryClient.setQueryData(["comments", variables.postId], (old: any) => {
        if (!old) return old
        return old.map((comment: any) => (comment.id === variables.id ? { ...comment, ...updatedComment } : comment))
      })
    },
  })
}

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      await commentApi.deleteComment(id)
      return { id, postId }
    },
    onSuccess: (_, variables) => {
      // 캐시 직접 업데이트
      queryClient.setQueryData(["comments", variables.postId], (old: any) => {
        if (!old) return old
        return old.filter((comment: any) => comment.id !== variables.id)
      })
    },
  })
}

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, likes, postId }: { id: number; likes: number; postId: number }) => {
      return await commentApi.likeComment(id, likes)
    },
    onMutate: async (variables) => {
      // Optimistic update: API 호출 전에 먼저 캐시 업데이트
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] })

      const previousComments = queryClient.getQueryData(["comments", variables.postId])

      queryClient.setQueryData(["comments", variables.postId], (old: any) => {
        if (!old) return old
        return old.map((comment: any) =>
          comment.id === variables.id ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
        )
      })

      return { previousComments, postId: variables.postId }
    },
    onError: (err, variables, context: any) => {
      // 에러 발생 시 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", context.postId], context.previousComments)
      }
    },
  })
}
