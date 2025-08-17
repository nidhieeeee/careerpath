import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Articles", path: "/admin/articles" },
  { label: "Institutes", path: "/admin/institute" },
  { label: "Merit Lists", path: "/admin/meritlists" },
  // { label: 'Exams', path: '/admin/exams' },
];

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-blue-900 text-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/admin/dashboard")}
        >
          <span className="ml-2 font-bold text-xl text-white">
            CareerPath Admin
          </span>
        </div>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive || location.pathname === item.path
                    ? "text-blue-300 font-semibold border-b-2 border-blue-300 pb-1"
                    : "text-white hover:text-blue-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
