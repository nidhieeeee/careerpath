import React, { useState } from 'react';
import MeritForm from '../components/admin/MeritForm';

const AdminMeritsPage = () => {
  const [merits, setMerits] = useState([
    {
      title: 'Gujarat Board Merit 2025',
      description: 'Top 100 merit list for Gujarat board.',
      date: '2025-06-05',
      document: 'https://example.com/gujarat-merit-2025.pdf'
    },
    {
      title: 'CBSE Board Merit 2025',
      description: 'List of CBSE top rankers.',
      date: '2025-06-10',
      document: 'https://example.com/cbse-merit-2025.pdf'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = (index) => {
    setFormData(merits[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = merits.filter((_, i) => i !== index);
    setMerits(updated);
  };

  return (
       <div className="min-h-screen bg-blue-50 text-blue-900 p-6">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowForm(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Show Merits
        </button>
        <button
          onClick={() => {
            setFormData({});
            setEditIndex(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Add Merit
        </button>
      </div>

      {showForm ? (
        <MeritForm
          data={merits}
          setData={setMerits}
          editIndex={editIndex}
          formData={formData}
          setFormData={setFormData}
          setEditIndex={setEditIndex}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {merits.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No merit lists added yet.</p>
          ) : (
            merits.map((merit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-blue-800">{merit.title}</h3>
                {merit.description && (
                  <p className="text-gray-600 mt-1">{merit.description}</p>
                )}
                {merit.date && (
                  <p className="text-sm text-gray-500 mt-2">
                    📅 <span className="font-semibold">Date:</span> {merit.date}
                  </p>
                )}
                {merit.document && (
                  <div className="mt-2">
                    <span className="font-semibold text-gray-700 mr-1">📄 Document:</span>
                    <a
                      href={merit.document}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                      View Document
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

export default AdminMeritsPage;
