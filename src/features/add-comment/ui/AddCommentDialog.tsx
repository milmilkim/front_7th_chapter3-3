import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useUIStore, usePostsStore } from "../../../app/store"
import { useAddComment } from "../model/useAddComment"

export const AddCommentDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const { currentPostId } = usePostsStore()
  const addCommentMutation = useAddComment()
  
  const [body, setBody] = useState("")

  const handleSubmit = () => {
    setBody("")
    closeModal("addComment")
    addCommentMutation.mutate(
      { body, postId: currentPostId, userId: 1 },
      {
        onError: (error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : "댓글 추가에 실패했습니다."
          alert(errorMessage)
        },
      }
    )
  }

  const open = isModalOpen("addComment")
  const onOpenChange = (open: boolean) => !open && closeModal("addComment")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
