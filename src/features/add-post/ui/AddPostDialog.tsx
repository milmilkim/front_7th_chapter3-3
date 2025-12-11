import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { useUIStore } from "../../../shared/store"
import { useAddPost } from "../../../entities/post"

export const AddPostDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const addPostMutation = useAddPost()
  
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [userId, setUserId] = useState(1)

  const handleSubmit = async () => {
    await addPostMutation.mutateAsync({ title, body, userId })
    setTitle("")
    setBody("")
    setUserId(1)
    closeModal("addPost")
  }

  const open = isModalOpen("addPost")
  const onOpenChange = (open: boolean) => !open && closeModal("addPost")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea rows={30} placeholder="내용" value={body} onChange={(e) => setBody(e.target.value)} />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
          />
          <Button onClick={handleSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
