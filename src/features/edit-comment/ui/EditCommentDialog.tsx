import { useState, useEffect } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import type { Comment } from "../../../entities/comment"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  onSubmit: (id: number, body: string) => void
}

export const EditCommentDialog = ({ open, onOpenChange, comment, onSubmit }: EditCommentDialogProps) => {
  const [body, setBody] = useState("")

  useEffect(() => {
    if (comment) {
      setBody(comment.body)
    }
  }, [comment])

  const handleSubmit = () => {
    if (comment) {
      onSubmit(comment.id, body)
      onOpenChange(false)
    }
  }

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
