import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import {
    Menu,
    X,
    LayoutDashboard,
    UploadCloud,
    Bug,
    Zap,
    MessageSquare,
    BookOpen,
    Lock,
} from "lucide-react";

const NavBar = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = () => {
            const storedUser = localStorage.getItem("loggedInUser");
            if (storedUser) {
                setUserInfo(JSON.parse(storedUser));
            } else {
                console.error("No user info found in localStorage");
            }
        };
        fetchUserInfo();
    }, []);

    const handleLogoutClick = async () => {
        try {
            await api.get("/logout");
            localStorage.removeItem("loggedInUser");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!userInfo) return <section className="mx-auto">Loading.....</section>;

    return (
        <nav className="w-full bg-[#0F172A] text-white md:fixed md:min-h-screen md:w-64">
            <div className="flex items-center justify-between border-b border-slate-600 px-4 py-4 md:block">
                <h1 className="text-xl font-bold">SprintSync</h1>
                <p className="hidden text-xs text-slate-400 md:block">Internal Platform</p>
                <div className="font-bold">{userInfo.email}</div>
                <button
                    className="text-white md:hidden"
                    onClick={() => setMobileMenu(!mobileMenu)}
                >
                    {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="hidden h-full flex-col justify-between md:flex">
                <div className="mt-4 flex flex-col space-y-1 px-4 text-sm">
                    <NavLinks />
                </div>
                <button
                    className="mx-3 mt-4 cursor-pointer rounded-md bg-purple-700 px-4 py-2 hover:bg-purple-600"
                    onClick={handleLogoutClick}
                >
                    Logout
                </button>
            </div>

            {mobileMenu && (
                <div className="flex flex-col space-y-2 px-4 py-4 text-sm md:hidden">
                    <NavLinks />
                    <button
                        className="mt-4 rounded-md bg-purple-700 px-4 py-2 hover:bg-purple-600"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

const NavLinks = () => {
    return (
        <>
            <Link to="/dashboard" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/deployment" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <UploadCloud size={18} /> Deployment
            </Link>
            <Link to="/qa-testing" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <Bug size={18} /> QA Testing
            </Link>
            <Link to="/ai-test-generator" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <Zap size={18} /> AI Test Generator
            </Link>
            <Link to="/retrospectives" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <MessageSquare size={18} /> Retrospectives
            </Link>
            <Link to="/task-journal" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <BookOpen size={18} /> Task Journal
            </Link>
            <Link to="/forms" className="flex items-center gap-3 rounded-md px-4 py-2 hover:bg-slate-700">
                <Lock size={18} /> Form Locker
            </Link>
        </>
    );
};

export default NavBar;
