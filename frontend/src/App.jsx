import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Chatbot from './components/TestGenius/Chatbot'
import NavBar from './components/Navbar/Navbar'
import Checklist from './components/DeployCheck/Checklist'
import SprintRetro from './components/Retrospective/SprintRetro'
import Login from './components/Login/Login'

function App() {

  return (
    <div className='flex flex-col'>
      <Router>
      <NavBar />
      <Routes>
        <Route path='/ai-test-generator' element={<Chatbot />} />
        <Route path='/deployment' element={<Checklist />} />
        <Route path='/retrospectives' element={<SprintRetro />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      </Router>
      </div>
  )
}

export default App
