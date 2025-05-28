import { useState } from "react";
import { Link } from "react-router-dom";
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
  Users,
} from "lucide-react";

const NavBar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
<nav className="bg-[#0F172A] text-white w-full md:w-64 md:min-h-screen md:fixed">
      {/* Top section */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-slate-600 md:block">
        <div>
          <h1 className="text-xl font-bold">SprintSync</h1>
          <p className="text-xs text-slate-400 hidden md:block">Internal Platform</p>
        </div>
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

        <UserCard />
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden flex flex-col space-y-2 px-4 py-4 text-sm">
          <NavLinks />
          <button className="bg-purple-700 px-4 py-2 mt-4 rounded-md hover:bg-purple-600">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

// Extracted for reuse
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
    <Link to="/communication-logbook" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <Users size={18} /> Communication Logbook
    </Link>
    <Link to="/form-locker" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-700 rounded-md">
      <Lock size={18} /> Form Locker
    </Link>
  </>
);

// User info card (only visible on desktop)
const UserCard = () => (
  <div className="p-4 border-t border-slate-600 flex items-center gap-3 bg-slate-800 rounded-md m-2">
    <img src="https://i.pravatar.cc/40" alt="User" className="h-10 w-10 rounded-full" />
    <div>
      <p className="font-semibold text-sm">John Doe</p>
      <p className="text-xs text-slate-400">john@company.com</p>
    </div>
  </div>
);

export default NavBar;
