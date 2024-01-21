import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn"
import AddHotel from "./pages/Hotel"
import { useAppContext } from "./contexts/AppContext"
import MyHotels from "./pages/MyHotels"
import EditHotel from "./pages/EditHotel"
import SearchBar from "./components/SearchBar"
import Search from "./pages/Search"

function App() {

  const {isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout> <p>Home page</p></Layout>}/>
        <Route path="/search" element={<Layout> <Search></Search></Layout>}/>
        <Route path="/register" element={<Layout><Register></Register></Layout>}/>
        <Route path="/sign-in" element={<Layout><SignIn></SignIn></Layout>}/>
        {
          isLoggedIn &&
          <>
            <Route path="/add-hotel" element={<Layout><AddHotel></AddHotel></Layout>}/>
            <Route path="/my-hotels" element={<Layout><MyHotels></MyHotels></Layout>}/>
            <Route path="/edit-hotel/:hotelId" element={<Layout><EditHotel></EditHotel></Layout>}/>
          </>
        }
        
      </Routes>
    </Router>
  )
}

export default App
