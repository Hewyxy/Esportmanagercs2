import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import viteLogo from './assets/vite.svg'
import './index.css'
import Navbar from './components/navbar.jsx'

//Pages Import
import Home from './pages/Home'
import Ranking from './pages/Ranking'
import Market from './pages/Market'
import News from './pages/News'
import Roaster from './pages/Roaster'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/market" element={<Market />} />
        <Route path="/news" element={<News />} />
        <Route path="/roaster" element={<Roaster />} />
      </Routes>

    </BrowserRouter>
  );
}



/* function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Navbar />
      <main>
      </main>
    </div>
  );
} */

export default App
