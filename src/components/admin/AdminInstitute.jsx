import React, { useState, useEffect, useRef, useMemo } from "react";
import useDataStore from "../../store/useDataStore";
import AdminNavbar from "../../components/admin/AdminNavbar";
import InstituteForm from "../../components/admin/InstituteForm";
import InstituteTable from "../../components/admin/InstituteTable";
import UnauthorizedAccess from "../../components/admin/UnauthorizedAccess";
import { Plus, List, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState(""); // <-- search state
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

  // Derived filtered list based on search term
  const filteredInstitutes = useMemo(() => {
    if (!searchTerm?.trim()) return institutes;

    const q = searchTerm.toLowerCase();

    return (institutes || []).filter((inst) => {
      const fields = [
        inst?.name,
        inst?.location?.city,
        inst?.location?.state,
        inst?.website,
        inst?.affilication,
        inst?.contact?.instituteEmail,
        inst?.contact?.instituteMobile,
      ];

      return fields.some(
        (field) =>
          typeof field === "string" &&
          field.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, institutes]);

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
      <div
        className="min-h-screen bg-gray-50 p-4 mt-32 sm:p-6 lg:p-8"
        ref={topRef}
      >
        <div className="max-w-7xl mx-auto">
          {/* --- CONDITIONAL VIEW RENDERING --- */}

          {view === "list" ? (
            // --- LIST VIEW ---
            <div>
              <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Institute Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Browse, search, add, and edit institute details.
                  </p>

                  {/* Search Bar */}
                  <div className="mt-4 max-w-md">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, city, email, etc."
                        className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm self-start"
                >
                  <Plus size={20} /> Add Institute
                </button>
              </header>
              <main>
                <InstituteTable
                  institutes={filteredInstitutes}
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