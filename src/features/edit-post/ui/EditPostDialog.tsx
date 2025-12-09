import { useState, useEffect } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import type { Post } from "../../../entities/post"

interface EditPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  onSubmit: (id: number, data: { title: string; body: string }) => void
}

export const EditPostDialog = ({ open, onOpenChange, post, onSubmit }: EditPostDialogProps) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setBody(post.body)
    }
  }, [post])

  const handleSubmit = () => {
    if (post) {
      onSubmit(post.id, { title, body })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={15} placeholder="내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={handleSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
