import { useState } from 'react'
import viteLogo from './assets/vite.svg'
import './index.css'
import Navbar from './components/navbar.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Navbar />
      <main>
      </main>
    </div>
  );
}

export default App
