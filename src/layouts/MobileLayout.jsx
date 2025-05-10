import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '../components/navigation/BottomNavigation';
import ScrollToTop from '../components/common/ScrollToTop';


const MobileLayout = ({ children }) => {
  const location = useLocation();
  const showScrollToTop = location.pathname !== '/';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-16">
        {children}
      </main>
      <BottomNavigation />
      {showScrollToTop && <ScrollToTop />}
    </div>
  );
};

export default MobileLayout;