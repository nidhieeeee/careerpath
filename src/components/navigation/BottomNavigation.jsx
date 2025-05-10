import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, GraduationCap, Building2, FileText, Contact } from 'lucide-react';

const BottomNavigation= () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/courses', icon: GraduationCap, label: 'Explore' },
    { path: '/institutes', icon: Building2, label: 'Institutes' },
    { path: '/articles', icon: FileText, label: 'Articles' },
    { path: '/contact', icon: Contact, label: 'Contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? 'text-blue-800' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;