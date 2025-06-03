import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Chatbot from "./components/TestGenius/Chatbot";
import Login from "./components/User/Login";
import FrontPage from "./components/LandingPage/FrontPage";
import Register from "./components/User/Register";
import Dashboard from "./components/User/Dashboard";
import PublicDashboard from "./components/LandingPage/PublicDashboard";
import PublicSprintRetro from "./components/LandingPage/PublicSprintRetro";
import PublicChecklist from "./components/LandingPage/PublicChecklist";
import RetroSpectives from "./components/User/RetroSpectives";

function App() {
    return (
        <div className="flex flex-col select-none">
            <Router>
                <Routes>
                    {/* Public Links */}
                    <Route path="/" element={<FrontPage />} />
                    <Route path="/ai-test-generator" element={<Chatbot />} />
                    <Route path="/publicdeployment" element={<PublicChecklist />} />
                    <Route path="/publicretrospectives" element={<PublicSprintRetro />} />
                    <Route path="/publicdashboard" element={<PublicDashboard />} />
                    {/* User Links */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard/:userid"
                        element={<Dashboard />}
                    ></Route>
                    <Route
                        path="/retrospectives/:userid"
                        element={<RetroSpectives />}
                    ></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
