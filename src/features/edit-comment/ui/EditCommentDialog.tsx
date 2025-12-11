import { useState, useEffect } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useUIStore, usePostsStore } from "../../../shared/store"
import { useUpdateComment } from "../../../entities/comment"

export const EditCommentDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const { selectedComment } = usePostsStore()
  const updateCommentMutation = useUpdateComment()
  
  const [body, setBody] = useState("")

  useEffect(() => {
    if (selectedComment) {
      setBody(selectedComment.body)
    }
  }, [selectedComment])

  const handleSubmit = async () => {
    if (selectedComment) {
      await updateCommentMutation.mutateAsync({
        id: selectedComment.id,
        body,
        postId: selectedComment.postId,
      })
      closeModal("editComment")
    }
  }

  const open = isModalOpen("editComment")
  const onOpenChange = (open: boolean) => !open && closeModal("editComment")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
