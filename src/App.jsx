import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

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

  return (
    <Router>
      <ScrollToTop/>
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
        {isMobile ? (
          <MobileLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/after-12th" element={<After12thPage />} />
              <Route path="/after-graduation" element={<AfterGraduationPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/institutes" element={<InstitutesPage />} />
              <Route path="/institutes/:id" element={<InstituteDetailPage />} />
              <Route path="/merit-list" element={<MeritListPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/after-12th" element={<After12thPage />} />
              <Route path="/after-graduation" element={<AfterGraduationPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/institutes" element={<InstitutesPage />} />
              <Route path="/institutes/:id" element={<InstituteDetailPage />} />
              <Route path="/merit-list" element={<MeritListPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </DesktopLayout>
        )}
      </SearchProvider>
    </Router>
  );
};

export default App;

// function App() {

//   return (
//     <>
//     <div className="min-h-screen bg-pink-400 flex items-center justify-center flex-col">
// {/* still not opninggggggggggggggggggggggggggggggggggggggggggggg i am cryingggggggggggggggggggggggggggggggggggggggggggggggggg */}
// {/* noooooooooooooooooooooooooooooooooooooooooooooo dont cryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy */}
// {/* strong kids dont cry i am just girl but not a crybaby😱 i want to cryyyyyyyyyyyy local host made me cry ohhhhhhhhhhhhhhhhhhhhhhhhh
// then we will move away from localhost !!!!!!!!!!!!!!!!!!! yey yoy can you see me?boi?? yeahhhhhhh gurlllllllllllllllll
// yeyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

// ek kaam karta mai tereko google meet ka link deta usme localhost ki screenshare kar deta wow
// but dont talk hah
// everyone is sleeping>>            maine baate karne ko meeting lagai bhi nai hai! just in caseeeeeeee
// koini yewww send link fast fast.. https://meet.google.com/jpc-ezhw-sfx
// gotit
// now what?   nowwwwwwww actually we have nothing to do.........
// barbie vibe  kindaaaa😱
// */}
//     <p className="font-bold text-white text-[200px]">Here We Go!!!</p>
//     <p className="font-bold text-white text-2xl"></p>

//     </div>
    
    

//     </>
//   )
// }

// export default App
