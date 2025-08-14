import React, { useEffect, useRef, useState } from 'react';
import axios from '../components/api/axios';
import InstituteForm from '../components/admin/InstituteForm';
import { toast } from 'react-toastify';
import useDataStore from '../store/useDataStore';
import AdminNavbar from '../components/admin/AdminNavbar';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [openCourses, setOpenCourses] = useState({});
  const listRef = useRef(null);
  const { isAdmin } = useDataStore();



if (!isAdmin) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-6">
          You are not authorized to view this page.  
          If you have admin credentials, please log in by clicking the button below.
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

  const fetchInstitutes = async () => {
    try {
      const res = await axios.get('/institutes');
      setInstitutes(res.data.reverse());
    } catch (err) {
      toast.error('Failed to fetch institutes');
    }
  };

  const createInstitute = async (data) => {
    try {
      const res = await axios.post('/institutes', data);
      setInstitutes((prev) => [res.data.form, ...prev]);
      toast.success('Institute added');
      setFormData({});
      scrollToList();
    } catch (err) {
      toast.error('Error adding institute');
    }
  };

  const updateInstitute = async (id, data) => {
    try {
      const res = await axios.put(`/institutes/${id}`, data);
      const updated = institutes.map((item) =>
        item._id === id ? res.data.institute : item
      );
      setInstitutes(updated);
      setEditIndex(null);
      setFormData({});
      toast.success('Institute updated');
      scrollToList();
    } catch (err) {
      toast.error('Error updating institute');
    }
  };

  const deleteInstitute = async (id) => {
    try {
      await axios.delete(`/institutes/${id}`);
      setInstitutes(institutes.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (index) => {
    setFormData(institutes[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData({});
    setEditIndex(null);
  };

  const toggleCourses = (id) => {
    setOpenCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToList = () => {
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center drop-shadow-sm">
            🎓 Admin Dashboard – Institutes
          </h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
          <InstituteForm
            formData={formData}
            setFormData={setFormData}
            editIndex={editIndex}
            createInstitute={createInstitute}
            updateInstitute={updateInstitute}
            cancelEdit={cancelEdit}
          />
        </div>

        {/* List */}
        <div ref={listRef} className="mt-14">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            📋 Institutes List
          </h2>

          {institutes.length === 0 ? (
            <p className="text-center text-gray-500 italic">No institutes added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutes.map((inst, index) => (
                <div
                  key={inst._id}
                  className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col justify-between h-full min-h-[430px] transition hover:shadow-xl"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-blue-800">{inst.name}</h3>
                    <p className="text-gray-700">
                      <strong>📍 City:</strong> {inst.location?.city}, {inst.location?.state}
                    </p>
                    <p className="text-gray-700">
                      <strong>🏢 Address:</strong> {inst.location?.address}
                    </p>
                    {inst.affilication && (
                      <p className="text-gray-700">
                        <strong>🏛️ Affiliation:</strong> {inst.affilication}
                      </p>
                    )}
                    {inst.website && (
                      <a
                        href={inst.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        🌐 Visit Website
                      </a>
                    )}

                    {inst.courses?.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => toggleCourses(inst._id)}
                          className="text-blue-700 font-medium underline text-sm"
                        >
                          {openCourses[inst._id] ? 'Hide Courses' : 'View Courses'}
                        </button>

                        {openCourses[inst._id] && (
                          <ul className="mt-2 list-disc list-inside text-gray-700 text-sm space-y-1">
                            {inst.courses.map((course, idx) => (
                              <li key={idx}>
                                <strong>{course.name}</strong> — {course.duration}, ₹{course.fees}, {course.seats} seats, {course.finance_type}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteInstitute(inst._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
