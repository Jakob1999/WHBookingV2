import { Route, Routes } from "react-router-dom"
import NavBar from "../src/components/NavBar"
import Footer from "../src/components/Footer"
import HomePage from "./pages/homePage"
import Trip from "./pages/trip"
import Apply from "./pages/apply"



function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip/:id" element={<Trip />} />
          <Route path="/trip/:id/apply" element={<Apply />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App