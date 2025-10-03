import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Courses", path: "/subadmin/courses" },
  { label: "Articles", path: "/subadmin/articles" },
  { label: "Merit Lists", path: "/subadmin/meritlists" },
];

const SubAdminNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-lg shadow-sm px-6 py-4 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logoCP.png"
            alt="CareerPath Logo"
            className="h-10 w-auto mr-2"
          />
          <span className="ml-2 font-bold text-xl text-gray-800">
            SubAdmin Dashboard
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `pb-2 px-3 py-1 font-medium transition-all duration-300 ease-in-out border-b-2 transform rounded-md ${
                  isActive
                    ? "text-white border-blue-600 scale-110 bg-blue-600 underline"
                    : "text-gray-600 border-transparent hover:text-white hover:scale-110 hover:bg-blue-600 hover:underline hover:border-blue-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
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
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `p-3 font-medium transition-all duration-300 ease-in-out rounded-lg ${
                    isActive
                      ? "text-white bg-blue-600 shadow-md"
                      : "text-gray-700 hover:text-white hover:bg-blue-600 hover:shadow-md"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SubAdminNavbar;
