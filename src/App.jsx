import { HashRouter, Routes, Route } from "react-router-dom";
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
import TournamentPage from "./pages/TounramentPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import FirstTimeLogIn from './components/FirstTimeLogIn.jsx'


// This is where the shared header, footer, and pages are wired together.
function App() {
  return (
    <HashRouter>
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
        <Route path="/tournament" element={<TournamentPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}


export default App
