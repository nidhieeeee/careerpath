import React, { useEffect, useRef, useState } from "react";
import axios from "../components/api/axios";
import InstituteForm from "../components/admin/InstituteForm";
import { toast } from "react-toastify";
import useDataStore from "../store/useDataStore";
import AdminNavbar from "../components/admin/AdminNavbar";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            You are not authorized to view this page. If you have admin
            credentials, please log in by clicking the button below.
          </p>
          <button
            onClick={() => navigate("/admin")}
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
      const res = await axios.get("/institutes");
      setInstitutes(res.data.reverse());
    } catch (err) {
      toast.error("Failed to fetch institutes");
    }
  };

  const createInstitute = async (data) => {
    try {
      const res = await axios.post("/institutes", data);
      setInstitutes((prev) => [res.data.form, ...prev]);
      toast.success("Institute added");
      setFormData({});
      scrollToList();
    } catch (err) {
      toast.error("Error adding institute");
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
      toast.success("Institute updated");
      scrollToList();
    } catch (err) {
      toast.error("Error updating institute");
    }
  };

  const deleteInstitute = async (id) => {
    try {
      await axios.delete(`/institutes/${id}`);
      setInstitutes(institutes.filter((i) => i._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (index) => {
    setFormData(institutes[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      listRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-10 text-center drop-shadow-lg tracking-tight">
            <span role="img" aria-label="cap">
              🎓
            </span>{" "}
            Admin Dashboard <span className="text-blue-600">– Institutes</span>
          </h1>

          {/* Form */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300 max-w-2xl mx-auto mb-12">
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
          <div ref={listRef} className="mt-16">
            <h2 className="text-3xl font-bold text-blue-800 mb-8 border-b-2 border-blue-200 pb-2 text-center tracking-tight flex items-center justify-center gap-2">
              <span role="img" aria-label="list">
                📋
              </span>{" "}
              Institutes List
            </h2>

            {institutes.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No institutes added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {institutes.map((inst, index) => (
                  <div
                    key={inst._id}
                    className="bg-white rounded-[2rem] shadow-xl border border-blue-200 p-7 flex flex-col justify-between h-full min-h-[430px] transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-bold text-blue-900 truncate">
                        {inst.name}
                      </h3>
                      <p className="text-gray-700">
                        <strong>📍 City:</strong> {inst.location?.city},{" "}
                        {inst.location?.state}
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
                          className="text-blue-700 underline text-sm font-medium hover:text-blue-900"
                        >
                          🌐 Visit Website
                        </a>
                      )}

                      {inst.courses?.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleCourses(inst._id)}
                            className="text-blue-700 font-medium underline text-sm hover:text-blue-900"
                          >
                            {openCourses[inst._id]
                              ? "Hide Courses"
                              : "View Courses"}
                          </button>

                          {openCourses[inst._id] && (
                            <ul className="mt-2 list-disc list-inside text-gray-700 text-sm space-y-1">
                              {inst.courses.map((course, idx) => (
                                <li key={idx}>
                                  <strong>{course.name}</strong> —{" "}
                                  {course.duration}, ₹{course.fees},{" "}
                                  {course.seats} seats, {course.finance_type}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-between gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-base px-6 py-2 rounded-xl shadow transition flex items-center gap-2 font-semibold"
                      >
                        <span role="img" aria-label="edit">
                          ✏️
                        </span>{" "}
                        Edit
                      </button>
                      <button
                        onClick={() => deleteInstitute(inst._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-base px-6 py-2 rounded-xl shadow transition flex items-center gap-2 font-semibold"
                      >
                        <span role="img" aria-label="delete">
                          🗑️
                        </span>{" "}
                        Delete
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
