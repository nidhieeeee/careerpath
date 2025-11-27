import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const navItems = [
  { label: "Institutes", path: "/admin/institutes" },
  { label: "Courses", path: "/admin/courses" },
  { label: "Articles", path: "/admin/articles" },
  { label: "Merit Lists", path: "/admin/meritlists" },
];

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="w-full bg-white/20 backdrop-blur-lg shadow-lg px-6 py-8 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <img
            src="/logoCP.png"
            alt="CareerPath Logo"
            className="h-10 w-auto mr-2"
          />
          <span className="ml-2 font-bold text-xl text-gray-800">
            CareerPath Admin
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 font-medium transition-all duration-300 rounded-lg ${
                  isActive || location.pathname === item.path
                    ? "text-white bg-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-white hover:bg-blue-600 hover:shadow-md"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => handleNavigation("/admin/account")}
              className="p-2 text-gray-600 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-300"
              title="Account Settings"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div
            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg border-t border-gray-200">
          <div className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavigation(item.path);
                }}
                className={`p-3 font-medium transition-all duration-300 rounded-lg text-left ${
                  location.pathname === item.path
                    ? "text-white bg-blue-600 shadow-md"
                    : "text-gray-700 hover:text-white hover:bg-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Profile Link */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleNavigation("/admin/account");
              }}
              className="p-3 font-medium transition-all duration-300 rounded-lg text-gray-700 hover:text-white hover:bg-blue-600 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Account Settings
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
