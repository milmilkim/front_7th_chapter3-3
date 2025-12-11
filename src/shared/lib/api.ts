const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path}`
}
