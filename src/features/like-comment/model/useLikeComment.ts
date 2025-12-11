import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../../../entities/comment/api"
import type { Comment } from "../../../entities/comment"

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
