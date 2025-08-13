import React, { useEffect, useRef, useState } from "react";
import axios from "../components/api/axios";
import { toast } from "react-toastify";
import useDataStore from "../store/useDataStore";
import AdminNavbar from "../components/admin/AdminNavbar";
import MeritListForm from "../components/admin/MeritForm";

const MeritListAdmin = () => {
  const [meritLists, setMeritLists] = useState([]);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const listRef = useRef(null);
  const { isAdmin } = useDataStore();

  if (!isAdmin) {
    window.location.href = "/admin";
    return null;
  }

  // Fetch all merit lists
  const fetchMeritLists = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/merit-lists`);
      setMeritLists(res.data.reverse());
    } catch (err) {
      toast.error("Failed to fetch merit lists");
    }
  };

  // Create new merit list
  const createMeritList = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/merit-lists`, data);
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
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/merit-lists/${id}`, data);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-green-900 mb-8 text-center drop-shadow-sm">
            Admin Dashboard – Merit Lists
          </h1>

          {/* Form */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
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
          <div ref={listRef} className="mt-14">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Merit Lists
            </h2>

            {meritLists.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No merit lists added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meritLists.map((ml, index) => (
                  <div
                    key={ml._id}
                    className="bg-white rounded-2xl shadow-md border border-green-100 p-5 flex flex-col justify-between min-h-[300px] transition hover:shadow-xl"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-bold text-green-800">
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
                        className="text-green-600 underline text-sm"
                      >
                        Download Merit List
                      </a>
                    </div>

                    <div className="mt-6 flex justify-between gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMeritList(ml._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition"
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
