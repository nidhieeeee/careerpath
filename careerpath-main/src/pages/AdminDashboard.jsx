import React, { useState } from 'react';
import InstituteForm from '../components/admin/InstituteForm';
import CourseForm from '../components/admin/CourseForm';
import MeritForm from '../components/admin/MeritForm';
import ArticleForm from '../components/admin/ArticleForm';
import ExamForm from '../components/admin/ExamForm';

const AdminDashboard = () => {
  const dummyInstitutes = [
    {
      title: 'ABC Institute',
      description: 'A leading institute for science education.',
      location: 'Ahmedabad',
      photo: '',
      link: 'https://abc.edu',
      date: '2025-06-01',
      document: ''
    },
    {
      title: 'XYZ Academy',
      description: 'Top coaching for engineering entrance exams.',
      location: 'Surat',
      photo: '',
      link: 'https://xyzacademy.com',
      date: '2025-05-15',
      document: ''
    }
  ];

  const dummyCourses = [
    {
      title: 'BSc Computer Science',
      description: '3-year UG program in Computer Science.',
      category: 'Science',
      photo: '',
      link: 'https://example.com/cs-course'
    }
  ];

  const dummyMerits = [
    {
      title: 'Gujarat Board Merit 2025',
      description: 'Top 100 merit list for Gujarat board.',
      date: '2025-06-05',
      document: ''
    }
  ];

  const dummyExams = [
    {
      id: '1',
      name: 'NEET UG 2025',
      date: '5 May 2025',
      type: 'Entrance Exam',
      category: 'Medical',
      level: 'Undergraduate',
      applyLink: 'https://neet.nta.nic.in/',
    },
    {
      id: '2',
      name: 'JEE Main 2025 - Session 1',
      date: '24 Jan 2025',
      type: 'Entrance Exam',
      category: 'Engineering',
      level: 'Undergraduate',
      applyLink: 'https://jeemain.nta.nic.in/',
    },
  ];

  const dummyArticles = [
    {
      title: 'How to choose a career after 12th?',
      description: 'A guide to help students pick the right stream.',
      location: 'Career Tips',
      photo: '',
      link: 'https://careerpath.com/article1',
      date: '2025-05-10',
      document: ''
    }
  ];

  const [formType, setFormType] = useState('home');
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [institutes, setInstitutes] = useState(dummyInstitutes);
  const [courses, setCourses] = useState(dummyCourses);
  const [merits, setMerits] = useState(dummyMerits);
  const [articles, setArticles] = useState(dummyArticles);
  const [exams, setExams] = useState(dummyExams);
  const defaultImage = 'https://via.placeholder.com/100x80.png?text=No+Image';

  const handleEdit = (type, index) => {
    const dataMap = {
      institute: institutes,
      course: courses,
      merit: merits,
      article: articles,
      exam: exams
    };
    setFormData(dataMap[type][index]);
    setEditIndex(index);
    setFormType(type);
  };

  const handleDelete = (type, index) => {
    const update = (list, setter) => setter(list.filter((_, i) => i !== index));
    if (type === 'institute') update(institutes, setInstitutes);
    if (type === 'course') update(courses, setCourses);
    if (type === 'merit') update(merits, setMerits);
    if (type === 'article') update(articles, setArticles);
    if (type === 'exam') update(exams, setExams);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900">
      <nav className="bg-blue-700 text-white p-4 flex justify-around font-semibold">
        <button onClick={() => { setFormType('home'); setFormData({}); setEditIndex(null); }}>Home</button>
        <button onClick={() => { setFormType('institute'); setFormData({}); setEditIndex(null); }}>Institutes</button>
        <button onClick={() => { setFormType('course'); setFormData({}); setEditIndex(null); }}>Courses</button>
        <button onClick={() => { setFormType('merit'); setFormData({}); setEditIndex(null); }}>Merit List</button>
        <button onClick={() => { setFormType('article'); setFormData({}); setEditIndex(null); }}>Articles</button>
        <button onClick={() => { setFormType('exam'); setFormData({}); setEditIndex(null); }}>Exams</button>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        {formType === 'home' && (
          <div className="text-center mt-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">🎓 Welcome to CareerPath Admin Panel</h1>
            <p className="text-lg md:text-xl text-blue-700 mb-10 max-w-3xl mx-auto">
              Overview of the data you've added:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {[
                ['Institutes', institutes, 'institute'],
                ['Courses', courses, 'course'],
                ['Merit Lists', merits, 'merit'],
                ['Articles', articles, 'article'],
                ['Exams', exams, 'exam']
              ].map(([label, items, type], index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-blue-200 text-left">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">{label}</h3>
                  {items.length > 0 ? (
                    <ul className="space-y-4">
                      {items.map((item, idx) => (
                        <li key={idx} className="bg-blue-50 border border-blue-100 p-4 rounded">
                          <div className="flex items-center gap-4">
                            <img src={item.photo || defaultImage} alt="Preview" className="w-24 h-20 object-cover rounded border" />
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-800">{item.title || item.name}</h4>
                              <p className="text-sm text-gray-600">{item.description || `${item.type || ''} | ${item.category || ''} | ${item.level || ''}`}</p>
                              {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">Visit Link</a>}
                              {item.applyLink && <a href={item.applyLink} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline block">Apply Now</a>}
                              {item.date && <p className="text-sm text-gray-500 mt-1">Date: {item.date}</p>}
                              {item.location && <p className="text-sm text-gray-500">Location: {item.location}</p>}
                              {item.category && <p className="text-sm text-gray-500">Category: {item.category}</p>}
                              {item.level && <p className="text-sm text-gray-500">Level: {item.level}</p>}
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2 text-sm">
                            {item.document && <a href={item.document} target="_blank" rel="noreferrer" className="text-blue-700 underline">📄 Document</a>}
                          </div>
                          <div className="mt-3 space-x-2">
                            <button onClick={() => handleEdit(type, idx)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                            <button onClick={() => handleDelete(type, idx)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 italic">No entries yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {formType === 'institute' && <InstituteForm data={institutes} setData={setInstitutes} editIndex={editIndex} formData={formData} setFormData={setFormData} setEditIndex={setEditIndex} />}
        {formType === 'course' && <CourseForm data={courses} setData={setCourses} editIndex={editIndex} formData={formData} setFormData={setFormData} setEditIndex={setEditIndex} />}
        {formType === 'merit' && <MeritForm data={merits} setData={setMerits} editIndex={editIndex} formData={formData} setFormData={setFormData} setEditIndex={setEditIndex} />}
        {formType === 'article' && <ArticleForm data={articles} setData={setArticles} editIndex={editIndex} formData={formData} setFormData={setFormData} setEditIndex={setEditIndex} />}
        {formType === 'exam' && <ExamForm data={exams} setData={setExams} editIndex={editIndex} formData={formData} setFormData={setFormData} setEditIndex={setEditIndex} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
