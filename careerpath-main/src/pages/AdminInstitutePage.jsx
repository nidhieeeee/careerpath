import React, { useState } from 'react';
import InstituteForm from '../components/admin/InstituteForm';

const AdminInstitutePage = () => {
  const defaultImage = 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg';

  const [institutes, setInstitutes] = useState([
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
    },
    {
      title: 'XYZ Academy',
      description: 'Top coaching for engineering entrance exams.',
      location: 'Surat',
      photo: '',
      link: 'https://xyzacademy.com',
      date: '2025-05-15',
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
    },
    {
      title: 'XYZ Academy',
      description: 'Top coaching for engineering entrance exams.',
      location: 'Surat',
      photo: '',
      link: 'https://xyzacademy.com',
      date: '2025-05-15',
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
    },
    {
      title: 'XYZ Academy',
      description: 'Top coaching for engineering entrance exams.',
      location: 'Surat',
      photo: '',
      link: 'https://xyzacademy.com',
      date: '2025-05-15',
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
    },
    {
      title: 'XYZ Academy',
      description: 'Top coaching for engineering entrance exams.',
      location: 'Surat',
      photo: '',
      link: 'https://xyzacademy.com',
      date: '2025-05-15',
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
    },
    {
      title: 'XYZ Academy',
      description: 'Top coaching for engineering entrance exams.',
      location: 'Surat',
      photo: '',
      link: 'https://xyzacademy.com',
      date: '2025-05-15',
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
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    setFormData(institutes[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = institutes.filter((_, i) => i !== index);
    setInstitutes(updated);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowForm(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Show Institutes
        </button>
        <button
          onClick={() => {
            setFormData({});
            setEditIndex(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Add Institute
        </button>
      </div>

      {showForm ? (
        <InstituteForm
          data={institutes}
          setData={setInstitutes}
          editIndex={editIndex}
          formData={formData}
          setFormData={setFormData}
          setEditIndex={setEditIndex}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {institutes.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No institutes added yet.</p>
          ) : (
            institutes.map((inst, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={inst.photo || defaultImage}
                    alt="Institute"
                    className="w-full md:w-40 h-40 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-2xl font-bold text-blue-800">{inst.title}</h3>
                    <p className="text-gray-600 mt-1">{inst.description}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p><span className="font-semibold">📍 Location:</span> {inst.location}</p>
                      <p><span className="font-semibold">📅 Date:</span> {inst.date}</p>
                      {inst.link && (
                        <a
                          href={inst.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          🔗 Visit Website
                        </a>
                      )}
                      {inst.document && (
                        <a
                          href={inst.document}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-blue-700 hover:underline"
                        >
                          📄 View Document
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

export default AdminInstitutePage;
