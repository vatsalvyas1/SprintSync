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
    LogOut,
    User,
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

    if (!userInfo) {
        return (
            <section className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-slate-400">Loading.....</div>
            </section>
        );
    }

    return (
        <nav className="w-full bg-[#0F172A] text-white md:fixed md:min-h-screen md:w-64 shadow-2xl">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-600/50 px-4 py-4 md:block">
                <div className="flex items-center space-x-2 md:block md:space-x-0">
                    <div className="flex items-center space-x-2 md:mb-1">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <span className="text-xs font-bold">SS</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">SprintSync</h1>
                    </div>
                    <p className="hidden text-xs text-slate-400/80 font-medium md:block">Internal Platform</p>
                </div>
                
                {/* User Info - Mobile */}
                <div className="flex items-center space-x-2 md:hidden">
                    <div className="text-right">
                        <div className="font-semibold text-sm">Welcome, {userInfo.name}</div>
                        <div className="text-xs text-slate-400">{userInfo.role}</div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="text-white md:hidden p-1 rounded-md hover:bg-slate-700/50 transition-colors duration-200"
                    onClick={() => setMobileMenu(!mobileMenu)}
                >
                    {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* User Info - Desktop */}
            <div className="hidden md:block px-4 py-3 border-b border-slate-600/30">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <User size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">Welcome, {userInfo.name}</div>
                        <div className="text-xs text-slate-400/80 font-medium">{userInfo.role}</div>
                    </div>
                </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden h-full flex-col justify-between md:flex">
                <div className="flex-1 mt-4">
                    <nav className="px-4 space-y-1">
                        <NavLinks />
                    </nav>
                </div>
                
                {/* Logout Button */}
                <div className="p-3">
                    <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 transition-all duration-200 font-medium text-sm"
                        onClick={handleLogoutClick}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenu && (
                <div className="md:hidden border-t border-slate-600/30">
                    <nav className="px-4 py-4 space-y-2">
                        <NavLinks />
                    </nav>
                    <div className="px-4 pb-4">
                        <button
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 transition-all duration-200 font-medium text-sm"
                            onClick={handleLogoutClick}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLinks = () => {
    return (
        <>
            <Link 
                to="/dashboard" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <LayoutDashboard size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">Dashboard</span>
            </Link>
            
            <Link 
                to="/deployment" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <UploadCloud size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">Deployment</span>
            </Link>
            
            <Link 
                to="/qa-testing" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <Bug size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">QA Testing</span>
            </Link>
            
            <Link 
                to="/ai-test-generator" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <Zap size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">AI Test Generator</span>
            </Link>
            
            <Link 
                to="/retrospectives" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <MessageSquare size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">Retrospectives</span>
            </Link>
            
            <Link 
                to="/task-journal" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <BookOpen size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">Task Journal</span>
            </Link>
            
            <Link 
                to="/forms" 
                className="group flex items-center gap-3 px-4 py-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <Lock size={18} className="relative z-10 group-hover:text-purple-400 transition-colors duration-200" />
                <span className="relative z-10 font-medium text-sm">Form Locker</span>
            </Link>
        </>
    );
};

export default NavBar;