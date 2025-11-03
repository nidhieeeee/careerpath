import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, GraduationCap } from 'lucide-react';
import SearchBar from '../common/SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'After 12th', path: '/after-12th' },
    { label: 'After Graduation', path: '/after-graduation' },
    { label: 'Courses', path: '/courses' },
    { label: 'Institutes', path: '/institutes' },
    { label: 'Merit List', path: '/merit-list' },
    { label: 'Articles', path: '/articles' },
    { label: 'Contact', path: '/contact' },
    { label: 'Exams' , path: '/exam'},
    { label: 'Admissions Guide', path: '/guidance' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 ${
        isScrolled
          ? 'bg-white shadow-md transition-all duration-300'
          : 'bg-transparent transition-all duration-300'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logoCP.png"
              alt="CareerPath Logo"
              className="w-20 h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === item.path
                    ? 'text-blue-800 border-b-2 border-blue-800'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Button */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pt-2 pb-4 px-4 animate-slideDown">
          <SearchBar />
          <nav className="mt-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;