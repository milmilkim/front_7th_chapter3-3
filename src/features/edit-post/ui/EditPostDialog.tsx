import { useState, useEffect } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { useUIStore, usePostsStore } from "../../../app/store"
import { useUpdatePost } from "../model/useUpdatePost"

export const EditPostDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const { selectedPost } = usePostsStore()
  const updatePostMutation = useUpdatePost()
  
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title)
      setBody(selectedPost.body)
    }
  }, [selectedPost])

  const handleSubmit = () => {
    if (selectedPost) {
      closeModal("editPost")
      updatePostMutation.mutate(
        { id: selectedPost.id, data: { title, body } },
        {
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "게시물 수정에 실패했습니다."
            alert(errorMessage)
          },
        }
      )
    }
  }

  const open = isModalOpen("editPost")
  const onOpenChange = (open: boolean) => !open && closeModal("editPost")

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
