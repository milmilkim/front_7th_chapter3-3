export type { Comment, CommentsResponse, CreateCommentDto, UpdateCommentDto } from './types'
export { commentApi } from './api'
export { useComments, useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from './model/useComments'
