import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../../../entities/comment/api"
import type { Comment } from "../../../entities/comment"

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
