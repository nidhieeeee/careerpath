import React, { useEffect, useRef, useState } from "react";
import axios from "../components/api/axios";
import { toast } from "react-toastify";
import useDataStore from "../store/useDataStore";
import AdminNavbar from "../components/admin/AdminNavbar";
import MeritListForm from "../components/admin/MeritForm";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MeritListAdmin = () => {
  const navigate = useNavigate();
  const [meritLists, setMeritLists] = useState([]);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
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

  // Fetch all merit lists
  const fetchMeritLists = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/merit-lists`
      );
      setMeritLists(res.data.reverse());
    } catch (err) {
      toast.error("Failed to fetch merit lists");
    }
  };

  // Create new merit list
  const createMeritList = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/merit-lists`,
        data
      );
      setMeritLists((prev) => [res.data, ...prev]);
      toast.success("Merit list added");
      setFormData({});
      scrollToList();
    } catch (err) {
      toast.error("Error adding merit list");
    }
  };

  // Update merit list
  const updateMeritList = async (id, data) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/merit-lists/${id}`,
        data
      );
      const updated = meritLists.map((item) =>
        item._id === id ? res.data : item
      );
      setMeritLists(updated);
      setEditIndex(null);
      setFormData({});
      toast.success("Merit list updated");
      scrollToList();
    } catch (err) {
      toast.error("Error updating merit list");
    }
  };

  // Delete merit list
  const deleteMeritList = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/merit-lists/${id}`);
      setMeritLists(meritLists.filter((m) => m._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (index) => {
    setFormData(meritLists[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setFormData({});
    setEditIndex(null);
  };

  const scrollToList = () => {
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  useEffect(() => {
    fetchMeritLists();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-2 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-10 text-center drop-shadow-lg tracking-tight">
            Admin Dashboard <span className="text-blue-600">– Merit Lists</span>
          </h1>

          {/* Form */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300 max-w-2xl mx-auto mb-12">
            <MeritListForm
              formData={formData}
              setFormData={setFormData}
              editIndex={editIndex}
              createMeritList={createMeritList}
              updateMeritList={updateMeritList}
              cancelEdit={cancelEdit}
            />
          </div>

          {/* List */}
          <div ref={listRef} className="mt-16">
            <h2 className="text-3xl font-bold text-blue-800 mb-8 border-b-2 border-blue-200 pb-2 text-center tracking-tight">
              Merit Lists
            </h2>

            {meritLists.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No merit lists added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {meritLists.map((ml, index) => (
                  <div
                    key={ml._id}
                    className="bg-white rounded-[2rem] shadow-xl border border-green-200 p-7 flex flex-col justify-between min-h-[300px] transition-all duration-200 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-bold text-green-900 truncate">
                        {ml.name}
                      </h3>
                      <p className="text-gray-700">
                        <strong>Date:</strong>{" "}
                        {new Date(ml.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <strong>Board:</strong> {ml.board}
                      </p>
                      <p className="text-gray-700">
                        <strong>New:</strong> {ml.isNew ? "Yes" : "No"}
                      </p>
                      <a
                        href={ml.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-700 underline text-sm font-medium hover:text-green-900"
                      >
                        Download Merit List
                      </a>
                    </div>

                    <div className="mt-8 flex justify-between gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-base px-6 py-2 rounded-xl shadow transition flex items-center gap-2 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMeritList(ml._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-base px-6 py-2 rounded-xl shadow transition flex items-center gap-2 font-semibold"
                      >
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

export default MeritListAdmin;
