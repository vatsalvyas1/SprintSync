import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axios";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";
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
} from "lucide-react";

const NavBar = ({ onLogout }) => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { speak, announce } = useAccessibility();

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
            speak("Logging out");
            await api.get("/logout");
            localStorage.removeItem("loggedInUser");
            onLogout();
            navigate("/login");
            announce("Successfully logged out");
        } catch (error) {
            console.error("Logout failed:", error);
            speak("Logout failed. Please try again.");
        }
    };

    if (!userInfo) {
        return (
            <section className="flex min-h-screen items-center justify-center">
                <div className="animate-pulse text-slate-400">Loading.....</div>
            </section>
        );
    }

    return (
        <nav className="w-full bg-[#0F172A] text-white shadow-2xl md:fixed md:min-h-screen md:w-64">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-slate-600/50 px-4 py-4 md:block">
                <div className="flex items-center space-x-2 md:block md:space-x-0">
                    <div className="flex items-center space-x-2 md:mb-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-blue-600">
                            <span className="text-xs font-bold">SS</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            SprintSync
                        </h1>
                    </div>
                    <p className="hidden text-xs font-medium text-slate-400/80 md:block">
                        Internal Platform
                    </p>
                </div>

                {/* User Info - Mobile */}
                <div className="flex items-center space-x-2 md:hidden">
                    <div className="text-right">
                        <div className="text-sm font-semibold">
                            Welcome, {userInfo.name}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="rounded-md p-1 text-white transition-colors duration-200 hover:bg-slate-700/50 md:hidden"
                    onClick={() => {
                        setMobileMenu(!mobileMenu);
                        speak(mobileMenu ? "Menu closed" : "Menu opened");
                    }}
                    aria-label={
                        mobileMenu
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={mobileMenu}
                    aria-controls="mobile-navigation"
                >
                    {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* User Info - Desktop */}
            <div className="hidden border-b border-slate-600/30 px-4 py-3 md:block">
                <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
                        <img
                            src={userInfo.avatar}
                            alt={`${userInfo.name}'s avatar`}
                            className="h-8 w-8 rounded-full object-cover"
                            draggable="false"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">
                            Welcome, {userInfo.name}
                        </div>
                        <div className="text-xs font-medium text-slate-400/80">
                            {userInfo.role}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden h-full flex-col justify-between md:flex">
                <div className="mt-4 flex-1">
                    <nav className="space-y-1 px-4">
                        <NavLinks currentPath={location.pathname} />
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="p-3">
                    <button
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-700 to-purple-600 px-4 py-2 text-sm font-medium transition-all duration-200 hover:from-purple-600 hover:to-purple-500"
                        onClick={handleLogoutClick}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenu && (
                <div
                    id="mobile-navigation"
                    className="border-t border-slate-600/30 md:hidden"
                    role="navigation"
                    aria-label="Mobile navigation menu"
                >
                    <nav className="space-y-2 px-4 py-4">
                        <NavLinks currentPath={location.pathname} />
                    </nav>
                    <div className="px-4 pb-4">
                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-700 to-purple-600 px-4 py-2 text-sm font-medium transition-all duration-200 hover:from-purple-600 hover:to-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
                            onClick={handleLogoutClick}
                            aria-label="Logout from account"
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

const NavLinks = ({ currentPath }) => {
    const { speak } = useAccessibility();

    const links = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/deployment", label: "Deployment", icon: UploadCloud },
        // { to: "/qa-testing", label: "QA Testing", icon: Bug },
        { to: "/ai-test-generator", label: "AI Test Generator", icon: Zap },
        { to: "/retrospectives", label: "Retrospectives", icon: MessageSquare },
        { to: "/task-journal", label: "Task Journal", icon: BookOpen },
        { to: "/forms", label: "Form Locker", icon: Lock },
    ];

    return (
        <>
            {links.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        className={`group relative flex items-center gap-3 overflow-hidden rounded-md px-4 py-2 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none ${
                            isActive
                                ? "bg-slate-700/50 text-white"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                        onFocus={() =>
                            speak(
                                `${label} navigation link${isActive ? ", current page" : ""}`
                            )
                        }
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`Navigate to ${label}${isActive ? " (current page)" : ""}`}
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 transition-opacity duration-200 ${
                                isActive
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                            }`}
                        />
                        <Icon
                            size={18}
                            className={`relative z-10 transition-colors duration-200 ${
                                isActive
                                    ? "text-purple-400"
                                    : "group-hover:text-purple-400"
                            }`}
                            aria-hidden="true"
                        />
                        <span className="relative z-10 text-sm font-medium">
                            {label}
                        </span>
                    </Link>
                );
            })}
        </>
    );
};

export default NavBar;
