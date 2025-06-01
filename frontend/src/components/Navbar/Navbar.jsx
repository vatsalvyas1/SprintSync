import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(null); // Replace this with real auth if needed
  const navigate = useNavigate();

  // Navigate to login route
  const handleLogin = () => {
    navigate("/login");
  };

  // Simulate logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className="bg-[#0F172A] text-white w-full md:w-64 md:min-h-screen md:fixed">
      {/* Top section */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-slate-600 md:block">
        <Link to="/">
          <h1 className="text-xl font-bold">SprintSync</h1>
          <p className="text-xs text-slate-400 hidden md:block">Internal Platform</p>
        </Link>
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
        {!user ? (
          <button
            className="m-4 px-4 py-2 bg-purple-700 rounded-md hover:bg-purple-600 font-medium"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <UserCard user={user} onLogout={handleLogout} />
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden flex flex-col space-y-2 px-4 py-4 text-sm">
          <NavLinks />
          {!user ? (
            <button
              className="bg-purple-700 px-4 py-2 mt-4 rounded-md hover:bg-purple-600"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <UserCard user={user} onLogout={handleLogout} mobile />
          )}
        </div>
      )}
    </nav>
  );
};

const NavLinks = () => (
  <>
    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <LayoutDashboard size={18} /> Dashboard
    </Link>
    <Link to="/deployment" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <UploadCloud size={18} /> Deployment
    </Link>
    <Link to="/qa-testing" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <Bug size={18} /> QA Testing
    </Link>
    <Link to="/ai-test-generator" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <Zap size={18} /> AI Test Generator
    </Link>
    <Link to="/retrospectives" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <MessageSquare size={18} /> Retrospectives
    </Link>
    <Link to="/task-journal" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <BookOpen size={18} /> Task Journal
    </Link>
    <Link to="/form-locker" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <Lock size={18} /> Form Locker
    </Link>
  </>
);

const UserCard = ({ user, onLogout, mobile }) => (
  <div className={`p-4 border-t border-slate-600 flex items-center gap-3 bg-slate-800 rounded-md m-2 ${mobile ? "mt-4" : ""}`}>
    <img src={user.avatar} alt="User" className="h-10 w-10 rounded-full" />
    <div>
      <p className="font-semibold text-sm">{user.name}</p>
      <p className="text-xs text-slate-400">{user.email}</p>
      <button
        className="mt-2 px-3 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  </div>
);

export default NavBar;
