import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Layout } from "../shared/ui"
import PostsManagerPage from "../pages/post-manager/PostsManagerPage.tsx"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Router>
        <Layout>
          <PostsManagerPage />
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App
