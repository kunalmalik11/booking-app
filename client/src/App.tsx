import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn"
import AddHotel from "./pages/Hotel"
import { useAppContext } from "./contexts/AppContext"

function App() {

  const {isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout> <p>Home page</p></Layout>}/>
        <Route path="/search" element={<Layout> <p>searching page</p></Layout>}/>
        <Route path="/register" element={<Layout><Register></Register></Layout>}/>
        <Route path="/sign-in" element={<Layout><SignIn></SignIn></Layout>}/>
        {
          isLoggedIn &&
          <>
            <Route path="/add-hotel" element={<Layout><AddHotel></AddHotel></Layout>}/>
          </>
        }
        
      </Routes>
    </Router>
  )
}

export default App
