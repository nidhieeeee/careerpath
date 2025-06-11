// import React, { useState } from 'react';
// import AdminArticlesPage from './AdminArticlesPage';
// import AdminCoursesPage from './AdminCoursesPAge';
// import AdminExamsPage from './AdminExamsPage';
// import AdminInstitutePage from './AdminInstitutePage';
// import AdminMeritsPage from './AdminMeritsPage';

// const AdminDashboard = () => {
//   const [formType, setFormType] = useState('home');

//   return (
//     <div className="min-h-screen bg-blue-50 text-blue-900">
//       <nav className="bg-blue-700 text-white p-4 flex justify-around font-semibold">
//         <button onClick={() => setFormType('home')}>Home</button>
//         <button onClick={() => setFormType('institute')}>Institutes</button>
//         <button onClick={() => setFormType('course')}>Courses</button>
//         <button onClick={() => setFormType('merit')}>Merit List</button>
//         <button onClick={() => setFormType('article')}>Articles</button>
//         <button onClick={() => setFormType('exam')}>Exams</button>
//       </nav>

//       <div className="p-6 max-w-6xl mx-auto">
//         {formType === 'home' && (
//           <div className="text-center mt-12">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">
//               🎓 Welcome to CareerPath Admin Panel
//             </h1>
//             <p className="text-lg md:text-xl text-blue-700 mb-10 max-w-3xl mx-auto">
//               Choose a section from the navbar to manage data.
//             </p>
//           </div>
//         )}

//         {formType === 'institute' && <AdminInstitutePage />}
//         {formType === 'course' && <AdminCoursesPage />}
//         {formType === 'merit' && <AdminMeritsPage />}
//         {formType === 'article' && <AdminArticlesPage />}
//         {formType === 'exam' && <AdminExamsPage />}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminArticlesPage from './AdminArticlesPage';
import AdminCoursesPage from './AdminCoursesPAge';
import AdminExamsPage from './AdminExamsPage';
import AdminInstitutePage from './AdminInstitutePage';
import AdminMeritsPage from './AdminMeritsPage';

const AdminDashboard = () => {
  const [formType, setFormType] = useState('home');

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900">
      <nav className="bg-blue-700 text-white p-4 flex justify-around font-semibold">
        <button onClick={() => setFormType('home')}>Home</button>
        <button onClick={() => setFormType('institute')}>Institutes</button>
        <button onClick={() => setFormType('course')}>Courses</button>
        <button onClick={() => setFormType('merit')}>Merit List</button>
        <button onClick={() => setFormType('article')}>Articles</button>
        <button onClick={() => setFormType('exam')}>Exams</button>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        {formType === 'home' && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 text-blue-800"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🎓 Welcome to CareerPath Admin Panel
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-blue-700 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Choose a section from the navbar to manage data.
            </motion.p>
          </motion.div>
        )}

        {formType === 'institute' && <AdminInstitutePage />}
        {formType === 'course' && <AdminCoursesPage />}
        {formType === 'merit' && <AdminMeritsPage />}
        {formType === 'article' && <AdminArticlesPage />}
        {formType === 'exam' && <AdminExamsPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;
