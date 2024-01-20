import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn"

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout> <p>Home page</p></Layout>}/>
        <Route path="/search" element={<Layout> <p>searching page</p></Layout>}/>
        <Route path="/register" element={<Layout><Register></Register></Layout>}/>
        <Route path="/sign-in" element={<Layout><SignIn></SignIn></Layout>}/>
      </Routes>
    </Router>
  )
}

export default App
