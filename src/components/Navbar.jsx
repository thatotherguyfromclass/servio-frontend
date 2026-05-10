import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  BriefcaseBusiness,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 h-18 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-violet-700 to-fuchsia-500 flex items-center justify-center shadow-md">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-gray-900">
              Servio
            </span>
            <span className="text-[11px] text-gray-400">
              Local services marketplace
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">

          {/* AUTHENTICATED */}
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-100 transition"
              >
                <User size={18} />
                <span className="font-medium">{user?.username}</span>
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-100 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            /* NOT AUTHENTICATED */
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-100 transition"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-violet-700 text-white hover:bg-violet-800 transition"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-5 py-5 bg-white">
          <div className="flex flex-col gap-3">

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-gray-100"
                >
                  <User size={18} />
                  {user?.username}
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-gray-100"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-gray-100"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-violet-700 text-white"
                >
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;