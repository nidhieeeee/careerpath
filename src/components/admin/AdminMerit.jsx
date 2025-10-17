import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../store/useDataStore";
import { useMeritLists } from "../../hooks/useMeritLists";
import AdminNavbar from "./AdminNavbar";
import MeritListTable from "./MeritListTable";
import MeritListForm from "./MeritForm"; // Assuming this form component is or will be refactored
import UnauthorizedAccess from "./UnauthorizedAccess";
import { Plus, List } from "lucide-react";

const MeritListAdmin = () => {
  const { role, initializeAuth } = useDataStore();
  const {
    meritLists,
    loading,
    addMeritList,
    updateMeritList,
    deleteMeritList,
  } = useMeritLists();

  const [view, setView] = useState("list");
  const [editingList, setEditingList] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const showFormView = (list = null) => {
    setEditingList(list);
    setView("form");
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showListView = () => {
    setEditingList(null);
    setView("list");
  };

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    let success = false;
    if (editingList) {
      success = await updateMeritList(editingList._id, formData);
    } else {
      success = await addMeritList(formData);
    }
    if (success) {
      showListView();
    }
    setIsSubmitting(false);
  };

  const handleDelete = (listId) => {
    if (window.confirm("Are you sure you want to delete this merit list?")) {
      deleteMeritList(listId);
    }
  };

  if (role === null)
    return <div className="min-h-screen bg-gray-50" ref={topRef} />;
  if (role !== "super") return <UnauthorizedAccess />;

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 mt-20 p-4 sm:p-6 lg:p-8" ref={topRef}>
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Merit List Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload and manage all merit lists.
                  </p>
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  <Plus size={20} /> Add Merit List
                </button>
              </header>
              <main>
                <MeritListTable
                  meritLists={meritLists}
                  loading={loading}
                  onEdit={showFormView}
                  onDelete={handleDelete}
                />
              </main>
            </div>
          ) : (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {editingList ? "Edit Merit List" : "Add New Merit List"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the details below.
                  </p>
                </div>
                <button
                  onClick={showListView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  <List size={20} /> Back to List
                </button>
              </header>
              <main className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                {/* IMPORTANT: You'll need to refactor `MeritForm.jsx` to accept these props, 
                  similar to how `InstituteForm` and `ArticleForm` were updated.
                */}
                <MeritListForm
                  initialData={editingList}
                  onSubmit={handleSave}
                  onCancel={showListView}
                  isSubmitting={isSubmitting}
                />
              </main>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MeritListAdmin;
