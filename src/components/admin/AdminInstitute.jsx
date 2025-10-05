import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../store/useDataStore";
import AdminNavbar from "../../components/admin/AdminNavbar";
import InstituteForm from "../../components/admin/InstituteForm";
import InstituteTable from "../../components/admin/InstituteTable";
import UnauthorizedAccess from "../../components/admin/UnauthorizedAccess";
import { Plus, List } from "lucide-react";
import axios from "../../components/api/axios";
import { toast } from "react-toastify";

const AdminInstitutes = () => {
  // Use the store for state management
  const { role, initializeAuth, institutes, loading, fetchInstitutes } =
    useDataStore();

  // 'list' or 'form' to control which view is shown
  const [view, setView] = useState("list");
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topRef = useRef(null);

  // Initialize auth and fetch data on component mount
  useEffect(() => {
    initializeAuth();
    if (role === "super") {
      fetchInstitutes();
    }
  }, [role, initializeAuth, fetchInstitutes]);

  // Handler to switch to the form view
  const showFormView = (institute = null) => {
    setEditingInstitute(institute);
    setView("form");
    // Scroll to the top for a better user experience
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handler to switch back to the list view
  const showListView = () => {
    setEditingInstitute(null);
    setView("list");
  };

  // Handler for form submission
  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingInstitute) {
        await axios.put(`/institutes/${editingInstitute._id}`, formData);
        toast.success("Institute updated successfully!");
      } else {
        await axios.post("/institutes", formData);
        toast.success("Institute added successfully!");
      }
      await fetchInstitutes(); // Refresh data from the server
      showListView(); // Go back to the list view after saving
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for deleting an institute
  const handleDelete = async (instituteId) => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      try {
        await axios.delete(`/institutes/${instituteId}`);
        toast.success("Institute deleted successfully.");
        await fetchInstitutes(); // Refresh data
      } catch (err) {
        toast.error("Failed to delete institute.");
      }
    }
  };

  // Authorization check
  if (role === null) {
    // Show a blank loading screen while the role is being determined
    return <div className="min-h-screen bg-gray-50" ref={topRef} />;
  }
  if (role !== "super") {
    return <UnauthorizedAccess />;
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8" ref={topRef}>
        <div className="max-w-7xl mx-auto">
          {/* --- CONDITIONAL VIEW RENDERING --- */}

          {view === "list" ? (
            // --- LIST VIEW ---
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Institute Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Browse, add, and edit institute details.
                  </p>
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  <Plus size={20} /> Add Institute
                </button>
              </header>
              <main>
                <InstituteTable
                  institutes={institutes}
                  loading={loading}
                  onEdit={showFormView} // Pass handler to switch views
                  onDelete={handleDelete}
                />
              </main>
            </div>
          ) : (
            // --- FORM VIEW ---
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {editingInstitute ? "Edit Institute" : "Add New Institute"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the form below and save your changes.
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
                <InstituteForm
                  initialData={editingInstitute}
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

export default AdminInstitutes;
