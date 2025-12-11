import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../../../entities/comment/api"
import type { Comment } from "../../../entities/comment"

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
