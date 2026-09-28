import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import Navbar from './components/navbar.jsx'
import Footer from './components/Footer.jsx'

//Pages Import
import Home from './pages/Home'
import Ranking from './pages/Ranking'
import Market from './pages/Market'
import News from './pages/News'
import Roaster from './pages/Roaster'
import Battle from './pages/Battle'
import Test from './pages/Test'
import FirstTimeLogIn from './components/FirstTimeLogIn.jsx'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <FirstTimeLogIn />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/market" element={<Market />} />
        <Route path="/news" element={<News />} />
        <Route path="/roaster" element={<Roaster />} />
        <Route path="/match" element={<Battle />}/>
        <Route path="/test" element={<Test />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}


export default App
