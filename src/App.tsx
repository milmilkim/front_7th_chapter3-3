import { BrowserRouter as Router } from "react-router-dom"
import { Layout } from "./shared/ui"
import PostsManagerPage from "./pages/post-manager/PostsManagerPage.tsx"

const App = () => {
  return (
    <Router>
      <Layout>
        <PostsManagerPage />
      </Layout>
    </Router>
  )
}

export default App
