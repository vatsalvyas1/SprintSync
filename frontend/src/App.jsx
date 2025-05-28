import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './components/TestGenius/Chatbot.css'
import Chatbot from './components/TestGenius/Chatbot'
import NavBar from './components/Navbar/Navbar'

function App() {

  return (
    <div className='flex flex-col'>
      <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Chatbot />} />
      </Routes>
      </Router>
      </div>
  )
}

export default App
