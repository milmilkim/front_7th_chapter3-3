import { useState, useEffect } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { useUIStore, usePostsStore } from "../../../app/store"
import { useComments } from "../../../entities/comment"
import { useUpdateComment } from "../model/useUpdateComment"

export const EditCommentDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const { selectedComment } = usePostsStore()
  const updateCommentMutation = useUpdateComment()
  
  const { data: comments = [] } = useComments(selectedComment?.postId || 0, !!selectedComment)
  
  const [body, setBody] = useState("")

  useEffect(() => {
    if (selectedComment) {
      setBody(selectedComment.body)
    }
  }, [selectedComment])

  const handleSubmit = () => {
    if (selectedComment) {
      // 현재 댓글의 인덱스 찾기
      const commentIndex = comments.findIndex(c => c.id === selectedComment.id)
      
      closeModal("editComment")
      updateCommentMutation.mutate(
        {
          id: selectedComment.id,
          index: commentIndex,
          body,
          postId: selectedComment.postId,
        },
        {
          onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : "댓글 수정에 실패했습니다."
            alert(errorMessage)
          },
        }
      )
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
