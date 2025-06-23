import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Chatbot from "./components/TestGenius/Chatbot";
import Login from "./components/User/Login";
import FrontPage from "./components/LandingPage/FrontPage";
import Register from "./components/User/Register";
import PublicDashboard from "./components/LandingPage/PublicDashboard";
import PublicSprintRetro from "./components/LandingPage/PublicSprintRetro";
import Checklist from "./components/Deployment/Checklist";
import NotFound from "./components/User/NotFound";
import AddForm from "./components/User/AddForm";
import FormLocker from "./components/FormLocker/FormLocker";
import NavBar from "./components/User/Navbar";
import ChecklistDetail from "./components/Deployment/ChecklistDetail";
import JournalPage from "./components/Journals/JournalPage";
import RetroSpectives from "./components/RetroSpectives/RetroSpectives";
import SprintManageRetroSpectives from "./components/RetroSpectives/SprintManageRetroSpectives";

// Create a component to handle conditional FrontPage rendering
function ConditionalFrontPage({ userInfoGlobal }) {
    const location = useLocation();
    
    // Only show FrontPage on home route when user is not logged in
    if (!userInfoGlobal && location.pathname === '/') {
        return <FrontPage />;
    }
    
    return null;
}

function AppContent() {
    const [userInfoGlobal, setUserInfoGlobal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();

        // Listen for storage events to handle login/logout from other tabs
        const handleStorageChange = () => {
            fetchUserInfo();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col select-none">
            {/* Show FrontPage conditionally based on route and login status */}
            <ConditionalFrontPage userInfoGlobal={userInfoGlobal} />

            {/* Show NavBar only if user IS logged in */}
            {userInfoGlobal && <NavBar />}

            <Routes>
                {/* Public Routes (accessible to everyone) */}
                <Route path="/ai-test-generator" element={<Chatbot />} />
                <Route path="/publicretrospectives" element={<PublicSprintRetro />} />
                <Route path="/publicdashboard" element={<PublicDashboard />} />
                <Route path="/login" element={userInfoGlobal ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={userInfoGlobal ? <Navigate to="/dashboard" /> : <Register />} />

                {/* Protected Routes (only accessible when logged in) */}
                <Route 
                    path="/dashboard" 
                    element={userInfoGlobal ? <PublicDashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/deployment" 
                    element={userInfoGlobal ? <Checklist /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/deployment/:checklistId" 
                    element={userInfoGlobal ? <ChecklistDetail /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/retrospectives" 
                    element={userInfoGlobal ? <SprintManageRetroSpectives /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/add-form/:userid" 
                    element={userInfoGlobal ? <AddForm /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/forms" 
                    element={userInfoGlobal ? <FormLocker /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/task-journal" 
                    element={userInfoGlobal ? <JournalPage /> : <Navigate to="/login" />} 
                />

                {/* Homepage redirect */}
                <Route 
                    path="/" 
                    element={userInfoGlobal ? <Navigate to="/dashboard" /> : null} 
                />

                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;