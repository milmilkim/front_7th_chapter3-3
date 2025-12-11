import { create } from 'zustand'
import type { Post } from '../../entities/post'
import type { Comment } from '../../entities/comment'

interface PostsStore {
  selectedPost: Post | null
  selectedComment: Comment | null
  selectedUserId: number | null
  currentPostId: number
  
  setSelectedPost: (post: Post | null) => void
  setSelectedComment: (comment: Comment | null) => void
  setSelectedUserId: (userId: number | null) => void
  setCurrentPostId: (postId: number) => void
  
  clearSelections: () => void
}

export const usePostsStore = create<PostsStore>((set) => ({
  selectedPost: null,
  selectedComment: null,
  selectedUserId: null,
  currentPostId: 0,
  
  setSelectedPost: (post) => set({ selectedPost: post }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  setSelectedUserId: (userId) => set({ selectedUserId: userId }),
  setCurrentPostId: (postId) => set({ currentPostId: postId }),
  
  clearSelections: () => set({
    selectedPost: null,
    selectedComment: null,
    selectedUserId: null,
    currentPostId: 0,
  }),
}))
