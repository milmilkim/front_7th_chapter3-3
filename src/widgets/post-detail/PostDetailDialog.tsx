import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"
import { CommentsList } from "../comments-list"
import { useUIStore, usePostsStore } from "../../shared/store"
import { useComments } from "../../entities/comment"
import { useQueryParams } from "../../shared/hooks"
import { highlightText } from "../../shared/lib"

export const PostDetailDialog = () => {
  const { isModalOpen, closeModal } = useUIStore()
  const { selectedPost } = usePostsStore()
  const { searchQuery } = useQueryParams()
  
  const { data: comments = [] } = useComments(selectedPost?.id || 0, !!selectedPost)

  const open = isModalOpen("postDetail")
  const onOpenChange = (open: boolean) => !open && closeModal("postDetail")

  if (!selectedPost) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost.body, searchQuery)}</p>
          <CommentsList postId={selectedPost.id} comments={comments} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
