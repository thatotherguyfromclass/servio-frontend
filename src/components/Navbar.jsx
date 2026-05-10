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
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-2xl transition ${
      isActive(path)
        ? "bg-violet-100 text-violet-700 font-semibold"
        : "hover:bg-gray-100"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-3 rounded-2xl transition ${
      isActive(path)
        ? "bg-violet-100 text-violet-700 font-semibold"
        : "hover:bg-gray-100"
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={closeMobile}>
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

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/profile"
                className={linkClass("/dashboard/profile")}
              >
                <User size={18} />
                <span className="font-medium">{user?.username}</span>
              </Link>

              <Link to="/dashboard" className={linkClass("/dashboard")}>
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
            <>
              <Link to="/login" className={linkClass("/login")}>
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

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-5 py-5 bg-white">
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/profile"
                  onClick={closeMobile}
                  className={mobileLinkClass("/dashboard/profile")}
                >
                  <User size={18} />
                  {user?.username}
                </Link>

                <Link
                  to="/dashboard"
                  onClick={closeMobile}
                  className={mobileLinkClass("/dashboard")}
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
                  onClick={closeMobile}
                  className={mobileLinkClass("/login")}
                >
                  <LogIn size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
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