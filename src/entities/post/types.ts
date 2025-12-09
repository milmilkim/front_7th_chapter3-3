export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  views?: number
  author?: {
    id: number
    username: string
    image: string
  }
}

export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export interface CreatePostDto {
  title: string
  body: string
  userId: number
}

export interface UpdatePostDto {
  title?: string
  body?: string
}
