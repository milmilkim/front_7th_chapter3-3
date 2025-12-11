import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../../../entities/comment/api"
import type { Comment } from "../../../entities/comment"

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
