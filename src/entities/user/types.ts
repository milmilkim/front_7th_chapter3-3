export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  image: string
  address?: {
    address: string
    city: string
    state: string
    postalCode?: string
  }
  company?: {
    name: string
    title: string
    department?: string
  }
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}
