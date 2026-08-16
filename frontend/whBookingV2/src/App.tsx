import { Route, Routes } from "react-router-dom"
import NavBar from "../src/components/NavBar"
import Footer from "../src/components/Footer"
import HomePage from "./pages/homePage"
import Trip from "./pages/trip"



function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip" element={<Trip />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App