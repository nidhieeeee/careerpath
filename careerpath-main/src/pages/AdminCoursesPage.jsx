import React, { useState } from 'react';
import CourseForm from '../components/admin/CourseForm';

const AdminCoursesPage = () => {
  const defaultImage = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg';

  const [courses, setCourses] = useState([
    {
      title: 'BSc Computer Science',
      description: '3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.3-year UG program in Computer Science.',
      category: 'Science',
      photo: '',
      link: 'https://example.com/cs-course'
    },
    {
      title: 'BCom',
      description: 'Bachelor of Commerce degree with finance specialization.',
      category: 'Commerce',
      photo: '',
      link: 'https://example.com/bcom'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    setFormData(courses[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
  };

  return (
       <div className="min-h-screen bg-blue-50 text-blue-900 p-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowForm(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Show Courses
        </button>
        <button
          onClick={() => {
            setFormData({});
            setEditIndex(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Add Course
        </button>
      </div>

      {showForm ? (
        <CourseForm
          data={courses}
          setData={setCourses}
          editIndex={editIndex}
          formData={formData}
          setFormData={setFormData}
          setEditIndex={setEditIndex}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No courses added yet.</p>
          ) : (
            courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={course.photo || defaultImage}
                    alt="Course"
                    className="w-full md:w-40 h-40 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-2xl font-bold text-blue-800">{course.title}</h3>
                    <p className="text-gray-600 mt-1">{course.description}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p><span className="font-semibold">📚 Category:</span> {course.category}</p>
                      {course.link && (
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          🔗 Visit Course
                        </a>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
