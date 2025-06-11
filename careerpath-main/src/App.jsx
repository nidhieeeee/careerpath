// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { useLocation } from 'react-router-dom';

// // Layouts
// import MobileLayout from './layouts/MobileLayout';
// import DesktopLayout from './layouts/DesktopLayout';

// // Pages
// import HomePage from './pages/HomePage';
// import After12thPage from './pages/After12thPage';
// import AfterGraduationPage from './pages/AfterGraduationPage';
// import CoursesPage from './pages/CoursesPage';
// import CourseDetailPage from './pages/CourseDetailPage';
// import InstitutesPage from './pages/InstitutesPage';
// import InstituteDetailPage from './pages/InstituteDetailPage';
// import MeritListPage from './pages/MeritListPage';
// import ArticlesPage from './pages/ArticlesPage';
// import ArticleDetailPage from './pages/ArticleDetailPage';
// import ContactPage from './pages/ContactPage';

// // Context
// import { SearchProvider } from './context/SearchContext';


// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

// const App = () => {
//   const isMobile = window.innerWidth < 768;

//   return (
//     <Router>
//       <ScrollToTop/>
//       <SearchProvider>
//         <Toaster 
//           position="top-center"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#0D47A1',
//               color: '#fff',
//               borderRadius: '8px',
//               fontSize: '14px',
//             },
//           }}
//         />
//         {isMobile ? (
//           <MobileLayout>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/after-12th" element={<After12thPage />} />
//               <Route path="/after-graduation" element={<AfterGraduationPage />} />
//               <Route path="/courses" element={<CoursesPage />} />
//               <Route path="/courses/:id" element={<CourseDetailPage />} />
//               <Route path="/institutes" element={<InstitutesPage />} />
//               <Route path="/institutes/:id" element={<InstituteDetailPage />} />
//               <Route path="/merit-list" element={<MeritListPage />} />
//               <Route path="/articles" element={<ArticlesPage />} />
//               <Route path="/articles/:id" element={<ArticleDetailPage />} />
//               <Route path="/contact" element={<ContactPage />} />
//             </Routes>
//           </MobileLayout>
//         ) : (
//           <DesktopLayout>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/after-12th" element={<After12thPage />} />
//               <Route path="/after-graduation" element={<AfterGraduationPage />} />
//               <Route path="/courses" element={<CoursesPage />} />
//               <Route path="/courses/:id" element={<CourseDetailPage />} />
//               <Route path="/institutes" element={<InstitutesPage />} />
//               <Route path="/institutes/:id" element={<InstituteDetailPage />} />
//               <Route path="/merit-list" element={<MeritListPage />} />
//               <Route path="/articles" element={<ArticlesPage />} />
//               <Route path="/articles/:id" element={<ArticleDetailPage />} />
//               <Route path="/contact" element={<ContactPage />} />
//             </Routes>
//           </DesktopLayout>
//         )}
//       </SearchProvider>
//     </Router>
//   );
// };

// export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';

// Pages
import HomePage from './pages/HomePage';
import After12thPage from './pages/After12thPage';
import AfterGraduationPage from './pages/AfterGraduationPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import InstitutesPage from './pages/InstitutesPage';
import InstituteDetailPage from './pages/InstituteDetailPage';
import MeritListPage from './pages/MeritListPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ContactPage from './pages/ContactPage';
import SearchResult from './pages/SearchResult';
import Adminlogin from './pages/Adminlogin';
import AdminDashboard from './pages/AdminDashboard';
import ExamsPage from './pages/ExamPage';

// Context
import { SearchProvider } from './context/SearchContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const isMobile = window.innerWidth < 768;

  const LayoutWrapper = ({ children }) => (
    isMobile ? <MobileLayout>{children}</MobileLayout> : <DesktopLayout>{children}</DesktopLayout>
  );

  return (
    <Router>
      <ScrollToTop />
      <SearchProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0D47A1',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />

        <Routes>
          {/* Routes WITHOUT Layout */}
          <Route path="/adminlogin" element={<Adminlogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />

          {/* Routes WITH Layout */}
          <Route path="/" element={<LayoutWrapper><HomePage /></LayoutWrapper>} />
          <Route path="/after-12th" element={<LayoutWrapper><After12thPage /></LayoutWrapper>} />
          <Route path="/after-graduation" element={<LayoutWrapper><AfterGraduationPage /></LayoutWrapper>} />
          <Route path="/courses" element={<LayoutWrapper><CoursesPage /></LayoutWrapper>} />
          <Route path="/courses/:id" element={<LayoutWrapper><CourseDetailPage /></LayoutWrapper>} />
          <Route path="/institutes" element={<LayoutWrapper><InstitutesPage /></LayoutWrapper>} />
          <Route path="/institutes/:id" element={<LayoutWrapper><InstituteDetailPage /></LayoutWrapper>} />
          <Route path="/merit-list" element={<LayoutWrapper><MeritListPage /></LayoutWrapper>} />
          <Route path="/articles" element={<LayoutWrapper><ArticlesPage /></LayoutWrapper>} />
          <Route path="/articles/:id" element={<LayoutWrapper><ArticleDetailPage /></LayoutWrapper>} />
          <Route path="/contact" element={<LayoutWrapper><ContactPage /></LayoutWrapper>} />
          <Route path="/search" element={<LayoutWrapper><SearchResult /></LayoutWrapper>} />
          <Route path="/exam" element={<LayoutWrapper><ExamsPage /></LayoutWrapper>} />
        </Routes>
      </SearchProvider>
    </Router>
  );
};

export default App;
