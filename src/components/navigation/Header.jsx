import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Building2,
  HelpCircle,
} from "lucide-react";
import SearchBar from "../common/SearchBar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // 4 Super Navbar Categories with their sub-items
  const navCategories = [
    {
      id: "explore",
      label: "Explore",
      icon: BookOpen,
      items: [
        {
          label: "Courses",
          path: "/courses",
          description: "Browse all courses",
        },
        {
          label: "Institutes",
          path: "/institutes",
          description: "Find top colleges",
        },
        { label: "Exams", path: "/exam", description: "Competitive exams" },
      ],
    },
    {
      id: "guidance",
      label: "Guidance",
      icon: GraduationCap,
      items: [
        {
          label: "After 12th",
          path: "/after-12th",
          description: "Plan your next step",
        },
        {
          label: "After Graduation",
          path: "/after-graduation",
          description: "Career options",
        },
        {
          label: "Admissions",
          path: "/guidance",
          description: "Admission tips",
        },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      icon: Building2,
      items: [
        {
          label: "Merit Lists",
          path: "/merit-list",
          description: "Check results",
        },
        {
          label: "Articles",
          path: "/articles",
          description: "Career articles",
        },
      ],
    },
    {
      id: "support",
      label: "Help & Support",
      icon: HelpCircle,
      items: [
        {
          label: "Help Desk",
          path: "/helpdesk",
          description: "Student resources & guidance",
        },
        { label: "Contact", path: "/contact", description: "Get in touch" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 ${
        isScrolled
          ? "bg-white shadow-md transition-all duration-300"
          : "bg-transparent transition-all duration-300"
      }`}
    >
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logoCP.png"
              alt="CareerPath Logo"
              className="w-32 h-32 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            <Link
              to="/"
              className={`px-4 py-3 text-base font-medium transition-colors rounded-md ${
                location.pathname === "/"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            {navCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="relative group">
                  <button className="px-4 py-3 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md flex items-center gap-1.5 transition-colors">
                    <Icon size={18} />
                    {category.label}
                    <ChevronDown
                      size={18}
                      className="group-hover:rotate-180 transition-transform"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-10">
                    {category.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-5 py-3 text-sm transition-colors ${
                          location.pathname === item.path
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <div className="font-medium text-base">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:block ml-auto flex-shrink-0">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-600 focus:outline-none ml-auto"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-100 animate-slideDown">
          <div className="px-4 py-4 space-y-3">
            <SearchBar />

            {/* Mobile Navigation */}
            <nav className="mt-4 space-y-1">
              <Link
                to="/"
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>

              {navCategories.map((category) => {
                const Icon = category.icon;
                const isOpen = activeDropdown === category.id;

                return (
                  <div key={category.id}>
                    <button
                      onClick={() =>
                        setActiveDropdown(isOpen ? null : category.id)
                      }
                      className="w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} />
                        {category.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    {isOpen && (
                      <div className="pl-4 space-y-1 mt-2 bg-blue-50 rounded-md py-2 border-l-4 border-blue-600 ml-2">
                        {category.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-3 py-2 rounded text-sm transition-all ${
                              location.pathname === item.path
                                ? "bg-blue-600 text-white font-semibold shadow-md"
                                : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                            }`}
                          >
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-75">
                              {item.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
