import React, { useEffect, useRef, useState } from "react";
import { Plus, List } from "lucide-react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import UnauthorizedAccess from "../../components/admin/UnauthorizedAccess";
import CourseForm from "../../components/admin/CourseForm";
import CourseTable from "../../components/admin/CourseTable";
import useDataStore from "../../store/useDataStore";
import { useCourses } from "../../hooks/useCourses"; // adjust path if needed

const AdminCourses = () => {
  const { role, initializeAuth } = useDataStore();

  const {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses,
  } = useCourses(); // all courses (super admin)

  const [view, setView] = useState("list"); // 'list' | 'form'
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const showFormView = (course = null) => {
    setEditingCourse(course);
    setView("form");
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showListView = () => {
    setEditingCourse(null);
    setView("list");
  };

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    let ok = false;

    if (editingCourse) {
      ok = await updateCourse(editingCourse._id, formData);
    } else {
      ok = await addCourse(formData);
    }

    if (ok) {
      await refreshCourses(); // ensure fresh list from server if needed
      showListView();
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;
    await deleteCourse(courseId);
    await refreshCourses();
  };

  // Auth checks
  if (role === null) {
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
          {view === "list" ? (
            // LIST VIEW
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Course Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Browse, add, and edit courses across institutes.
                  </p>
                  {error && (
                    <p className="text-sm text-red-500 mt-1">
                      Error: {error}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm"
                >
                  <Plus size={20} /> Add Course
                </button>
              </header>
              <main>
                <CourseTable
                  courses={courses}
                  loading={loading}
                  onEdit={showFormView}
                  onDelete={handleDelete}
                />
              </main>
            </div>
          ) : (
            // FORM VIEW
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {editingCourse ? "Edit Course" : "Add New Course"}
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
                <CourseForm
                  initialData={editingCourse}
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

export default AdminCourses;