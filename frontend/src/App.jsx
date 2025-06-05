import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Chatbot from "./components/TestGenius/Chatbot";
import Login from "./components/User/Login";
import FrontPage from "./components/LandingPage/FrontPage";
import Register from "./components/User/Register";
import Dashboard from "./components/User/Dashboard";
import PublicDashboard from "./components/LandingPage/PublicDashboard";
import PublicSprintRetro from "./components/LandingPage/PublicSprintRetro";
import PublicChecklist from "./components/Deployment/PublicChecklist";
import RetroSpectives from "./components/User/RetroSpectives";
import NotFound from "./components/User/NotFound";
import AddForm from "./components/User/AddForm";
import FormLocker from "./components/FormLocker/FormLocker";
import FormLocker2 from "./components/FormLocker/FormLocker2";
import NavBar from "./components/User/Navbar";

function App() {
    const [userInfoGlobal, setUserInfoGlobal] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const loggedInUser = localStorage.getItem("loggedInUser");
                if (loggedInUser) {
                    const userInfo = JSON.parse(loggedInUser);
                    setUserInfoGlobal(userInfo);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div className="flex flex-col select-none">
            <Router>
                {/* Show FrontPage only if user is NOT logged in */}
                {!userInfoGlobal && <FrontPage />}

                {/* Show NavBar only if user IS logged in */}
                {userInfoGlobal && <NavBar />}

                <Routes>
                    {/* Public Routes (accessible to everyone) */}
                    <Route path="/ai-test-generator" element={<Chatbot />} />
                    <Route path="/deployment" element={<PublicChecklist />} />
                    <Route path="/publicretrospectives" element={<PublicSprintRetro />} />
                    <Route path="/publicdashboard" element={<PublicDashboard />} />
                    <Route path="/public-locker" element={<FormLocker2 />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes (only accessible when logged in) */}
                    {userInfoGlobal && (
                        <>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/retrospectives" element={<RetroSpectives />} />
                            <Route path="/add-form/:userid" element={<AddForm />} />
                            <Route path="/forms" element={<FormLocker />} />
                        </>
                    )}

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;