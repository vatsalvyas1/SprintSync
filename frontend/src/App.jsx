import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Chatbot from "./components/TestGenius/Chatbot";
import NavBar from "./components/User/Navbar";
import Checklist from "./components/DeployCheck/Checklist";
import SprintRetro from "./components/Retrospective/SprintRetro";
import Login from "./components/User/Login";
import FrontPage from "./components/LandingPage/FrontPage";
import Register from "./components/User/Register";
import SampleDashboard from "./components/LandingPage/SampleDashboard";
import Dashboard from "./components/User/Dashboard";

function App() {
    return (
        <div className="flex flex-col select-none">
            <Router>
                {/* <NavBar /> */}
                <Routes>
                    <Route path="/" element={<FrontPage />} />
                    <Route path="/ai-test-generator" element={<Chatbot />} />
                    <Route path="/deployment" element={<Checklist />} />
                    <Route path="/retrospectives" element={<SprintRetro />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/sampledashboard" element={<SampleDashboard />} />
                    <Route
                        path="/dashboard/:userid"
                        element={<Dashboard />}
                    ></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
