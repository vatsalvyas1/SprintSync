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
import NotFound from "./components/User/NotFound";
import AddForm from "./components/User/AddForm";
import FormList from "./components/User/FormList";
import FormLocker2 from "./components/FormLocker/FormLocker2";
import FormLocker from "./components/FormLocker/FormLocker";

function App() {
    return (
        <div className="flex flex-col select-none">
            <Router>
                <Routes>
                    {/* Public Links */}
                    <Route path="/" element={<FrontPage />} />
                    <Route path="/ai-test-generator/:userid" element={<Chatbot />} />
                    <Route path="/publicdeployment" element={<PublicChecklist />} />
                    <Route path="/publicretrospectives" element={<PublicSprintRetro />} />
                    <Route path="/publicdashboard" element={<PublicDashboard />} />
                    <Route path="/public-locker" element={<FormLocker2 />} />
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
                    <Route path="/add-form/:userid" element={<AddForm />} />
                    <Route path="/forms" element={<FormLocker />} />
                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
