import { useEffect, useState, useContext } from "react";
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
import { UserContext } from "./UserProvider";

const NavBar = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const { userInfoGlobal, setUserInfoGlobal } = useContext(UserContext);
    const navigate = useNavigate();

    // Simulate logout
    const handleLogoutClick = async () => {
        try {
            const res = await api.get("/logout");
            console.log(res);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    if (!userInfoGlobal)
        return <section className="mx-auto">Loading.....</section>;

    return (
        <nav className="bg-[#0F172A] text-white w-full md:w-64 md:min-h-screen md:fixed">
            {/* Top section */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-slate-600 md:block">
                <h1 className="text-xl font-bold">SprintSync</h1>
                <p className="text-xs text-slate-400 hidden md:block">
                    Internal Platform
                </p>
                <div className="font-bold">{userInfoGlobal.email}</div>
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenu(!mobileMenu)}
                >
                    {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-col justify-between h-full">
                <div className="flex flex-col space-y-1 mt-4 px-4 text-sm">
                    <NavLinks />
                </div>
                <button
                    className="bg-purple-700 px-4 py-2 mt-4 mx-3 rounded-md hover:bg-purple-600"
                    onClick={handleLogoutClick}
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="md:hidden flex flex-col space-y-2 px-4 py-4 text-sm">
                    <NavLinks />
                    <button
                        className="bg-purple-700 px-4 py-2 mt-4 rounded-md hover:bg-purple-600"
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
    const { userInfoGlobal, setUserInfoGlobal } = useContext(UserContext);

    if (!userInfoGlobal)
        return <section className="mx-auto">Loading.....</section>;

    return (
        <>
            <Link
                to={`/dashboard/${userInfoGlobal._id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
                to="/deployment"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <UploadCloud size={18} /> Deployment
            </Link>
            <Link
                to="/qa-testing"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <Bug size={18} /> QA Testing
            </Link>
            <Link
                to="/ai-test-generator"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <Zap size={18} /> AI Test Generator
            </Link>
            <Link
                to={`/retrospectives/${userInfoGlobal._id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <MessageSquare size={18} /> Retrospectives
            </Link>
            <Link
                to="/task-journal"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <BookOpen size={18} /> Task Journal
            </Link>
            <Link
                to="/form-locker"
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md"
            >
                <Lock size={18} /> Form Locker
            </Link>
        </>
    );
};

// const UserCard = ({ user, onLogout, mobile }) => (
//     <div
//         className={`p-4 border-t border-slate-600 flex items-center gap-3 bg-slate-800 rounded-md m-2 ${mobile ? "mt-4" : ""}`}
//     >
//         <img src={user.avatar} alt="User" className="h-10 w-10 rounded-full" />
//         <div>
//             <p className="font-semibold text-sm">{user.name}</p>
//             <p className="text-xs text-slate-400">{user.email}</p>
//             <button
//                 className="mt-2 px-3 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600"
//                 onClick={onLogout}
//             >
//                 Logout
//             </button>
//         </div>
//     </div>
// );

export default NavBar;
