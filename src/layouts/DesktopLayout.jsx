import React, { ReactNode } from 'react';
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';
import ScrollToTop from '../components/common/ScrollToTop';



const DesktopLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default DesktopLayout;