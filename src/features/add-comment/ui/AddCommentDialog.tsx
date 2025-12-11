import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useUIStore, usePostsStore } from "../../../shared/store"
import { useAddComment } from "../../../entities/comment"

export const AddCommentDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const { currentPostId } = usePostsStore()
  const addCommentMutation = useAddComment()
  
  const [body, setBody] = useState("")

  const handleSubmit = async () => {
    await addCommentMutation.mutateAsync({ body, postId: currentPostId, userId: 1 })
    setBody("")
    closeModal("addComment")
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
