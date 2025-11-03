import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useDataStore from "./store/useDataStore";

// Layouts
import MobileLayout from "./layouts/MobileLayout";
import DesktopLayout from "./layouts/DesktopLayout";

// Pages
import HomePage from "./pages/HomePage";
import After12thPage from "./pages/After12thPage";
import AfterGraduationPage from "./pages/AfterGraduationPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import InstitutesPage from "./pages/InstitutesPage";
import InstituteDetailPage from "./pages/InstituteDetailPage";
import MeritListPage from "./pages/MeritListPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ContactPage from "./pages/ContactPage";
import SearchResult from "./pages/SearchResult";
import ExamsPage from "./pages/ExamPage";
import AdmissionsGuide from "./pages/guidancePage.jsx";

// Admin Components
import Adminlogin from "./components/admin/Adminlogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminInstitute from "./components/admin/AdminInstitute";
import AdminArticles from "./components/admin/AdminArticles";
import AdminAccount from "./components/admin/AdminAccount";
import MeritListAdmin from "./components/admin/AdminMerit";

// SubAdmin Components
import SubAdminDashboard from "./components/admin/sub/SubAdminDashboard";
import SubAdminCourses from "./components/admin/sub/SubAdminCourses";
import SubAdminArticles from "./components/admin/sub/SubAdminArticles";
import SubAdminMeritLists from "./components/admin/sub/SubAdminMeritLists";
import SubAdminAccount from "./components/admin/sub/SubAdminAccount";
import InstituteDetailsPage from "./components/admin/sub/InstituteDetailsPage";

// Context
import { SearchProvider } from "./context/SearchContext";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const isMobile = window.innerWidth < 768;

  const initializeAuth = useDataStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []);

  const LayoutWrapper = ({ children }) =>
    isMobile ? (
      <MobileLayout>{children}</MobileLayout>
    ) : (
      <DesktopLayout>{children}</DesktopLayout>
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
              background: "#0D47A1",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
        />

        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Adminlogin />} />

          {/* Admin Routes (WITHOUT Layout) */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/account" element={<AdminAccount />} />
          <Route path="/admin/institutes" element={<AdminInstitute />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/meritlists" element={<MeritListAdmin />} />

          {/* SubAdmin Routes (WITHOUT Layout) */}
          <Route path="/subadmin/dashboard" element={<SubAdminDashboard />} />
          <Route path="/subadmin/account" element={<SubAdminAccount />} />
          <Route path="/subadmin/courses" element={<SubAdminCourses />} />
          <Route path="/subadmin/articles" element={<SubAdminArticles />} />
          <Route path="/subadmin/meritlists" element={<SubAdminMeritLists />} />
          <Route
            path="/subadmin/institute/:id"
            element={<InstituteDetailsPage />}
          />
          <Route path="/guidance" element={<AdmissionsGuide />} />

          {/* Public Routes (WITH Layout) */}
          <Route
            path="/"
            element={
              <LayoutWrapper>
                <HomePage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/after-12th"
            element={
              <LayoutWrapper>
                <After12thPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/after-graduation"
            element={
              <LayoutWrapper>
                <AfterGraduationPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/courses"
            element={
              <LayoutWrapper>
                <CoursesPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <LayoutWrapper>
                <CourseDetailPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/institutes"
            element={
              <LayoutWrapper>
                <InstitutesPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/institutes/:id"
            element={
              <LayoutWrapper>
                <InstituteDetailPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/merit-list"
            element={
              <LayoutWrapper>
                <MeritListPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/articles"
            element={
              <LayoutWrapper>
                <ArticlesPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <LayoutWrapper>
                <ArticleDetailPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <LayoutWrapper>
                <ContactPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/search"
            element={
              <LayoutWrapper>
                <SearchResult />
              </LayoutWrapper>
            }
          />
          <Route
            path="/exam"
            element={
              <LayoutWrapper>
                <ExamsPage />
              </LayoutWrapper>
            }
          />
        </Routes>
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
