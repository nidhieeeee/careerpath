import React, { useState } from 'react';
import ExamForm from '../components/admin/ExamForm';

const AdminExamsPage = () => {
  const [exams, setExams] = useState([
    {
      title: 'NEET UG 2025',
      date: '2025-05-05',
      type: 'Entrance Exam',
      category: 'Medical',
      level: 'National',
      applyLink: 'https://neet.nta.nic.in/'
    },
    {
      title: 'JEE Main 2025 - Session 1',
      date: '2025-01-24',
      type: 'Entrance Exam',
      category: 'Engineering',
      level: 'National',
      applyLink: 'https://jeemain.nta.nic.in/'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    setFormData(exams[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = exams.filter((_, i) => i !== index);
    setExams(updated);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowForm(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Show Exams
        </button>
        <button
          onClick={() => {
            setFormData({});
            setEditIndex(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Add Exam
        </button>
      </div>

      {showForm ? (
        <ExamForm
          data={exams}
          setData={setExams}
          editIndex={editIndex}
          formData={formData}
          setFormData={setFormData}
          setEditIndex={setEditIndex}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No exams added yet.</p>
          ) : (
            exams.map((exam, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-blue-800">{exam.title}</h3>
                <p className="text-gray-600 mt-1">{exam.type} — {exam.category}</p>
                <p className="text-sm text-gray-500 mt-1">
                  🎯 <span className="font-semibold">Level:</span> {exam.level}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  📅 <span className="font-semibold">Date:</span> {exam.date}
                </p>
                {exam.applyLink && (
                  <div className="mt-2">
                    <span className="font-semibold text-gray-700 mr-1">🔗 Apply Link:</span>
                    <a
                      href={exam.applyLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                      Apply Now
                    </a>
                  </div>
                )}
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminExamsPage;
