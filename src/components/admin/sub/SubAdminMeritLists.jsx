import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../../store/useDataStore";
import { useMeritLists } from "../../../hooks/useMeritLists";
import SubAdminNavbar from "./SubAdminNavbar";
// import MeritListTable from "../MeritListTable";
import MeritListForm from "../MeritForm";
import UnauthorizedAccess from "../UnauthorizedAccess";
import {
  Plus,
  List,
  Trophy,
  FileText,
  Calendar,
  Download,
  Users,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubAdminMeritLists = () => {
  const { role, initializeAuth, isLoggedIn, user } = useDataStore();
  const {
    meritLists,
    loading,
    addMeritList,
    updateMeritList,
    deleteMeritList,
  } = useMeritLists();
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [editingList, setEditingList] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredMeritLists, setFilteredMeritLists] = useState([]);
  const topRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Filter merit lists by subadmin's institute
  useEffect(() => {
    if (meritLists && user?.institute) {
      const instituteMeritLists = meritLists.filter(
        (list) =>
          list.institute === user.institute ||
          list.instituteId === user.institute
      );
      setFilteredMeritLists(instituteMeritLists);
    } else {
      setFilteredMeritLists(meritLists || []);
    }
  }, [meritLists, user]);

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

    // Add institute information to form data for subadmin
    const submissionData = {
      ...formData,
      institute: user?.institute || formData.institute,
      instituteId: user?.institute || formData.instituteId,
      instituteName: user?.instituteName || formData.instituteName,
      createdBy: user?.id || user?._id,
    };

    let success = false;
    if (editingList) {
      success = await updateMeritList(editingList._id, submissionData);
    } else {
      success = await addMeritList(submissionData);
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

  const getMeritListStats = () => {
    const total = filteredMeritLists.length;
    const published = filteredMeritLists.filter(
      (list) => list.status === "published"
    ).length;
    const draft = filteredMeritLists.filter(
      (list) => list.status === "draft"
    ).length;
    const thisMonth = filteredMeritLists.filter((list) => {
      const listDate = new Date(list.createdAt);
      const now = new Date();
      return (
        listDate.getMonth() === now.getMonth() &&
        listDate.getFullYear() === now.getFullYear()
      );
    }).length;

    return { total, published, draft, thisMonth };
  };

  const stats = getMeritListStats();

  if (role === null) {
    return <div className="min-h-screen bg-gray-50" ref={topRef} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l7 6v6c0 5-3.5 9-7 9s-7-4-7-9V8l7-6z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">Redirecting to login page...</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (role !== "sub") {
    return <UnauthorizedAccess />;
  }

  return (
    <>
      <SubAdminNavbar />
      <div
        className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 mt-32"
        ref={topRef}
      >
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                    Merit List Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Create and manage merit lists for your institute.
                  </p>
                  {user?.institute && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Users className="w-4 h-4 mr-1" />
                        Institute: {user.instituteName || user.institute}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <Plus size={20} /> Add Merit List
                </button>
              </header>

              {/* Merit List Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Total Lists
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Published
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.published}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Draft
                      </h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {stats.draft}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        This Month
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.thisMonth}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <main>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredMeritLists.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No merit lists found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by creating your first merit list for this
                      institute.
                    </p>
                    <button
                      onClick={() => showFormView()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Merit List
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMeritLists.map((meritList) => (
                      <div
                        key={meritList._id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="p-2 bg-yellow-100 rounded-lg">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                  {meritList.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {meritList.category || meritList.board}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              Published:{" "}
                              {new Date(
                                meritList.publishDate || meritList.createdAt
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-2" />
                              {meritList.totalStudents || "N/A"} Students
                            </div>
                            {meritList.course && (
                              <div className="flex items-center text-sm text-gray-500">
                                <FileText className="w-4 h-4 mr-2" />
                                Course: {meritList.course}
                              </div>
                            )}
                          </div>

                          {meritList.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {meritList.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  meritList.status === "published"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {meritList.status || "Published"}
                              </span>
                              {meritList.fileUrl && (
                                <a
                                  href={meritList.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  PDF
                                </a>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => showFormView(meritList)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(meritList._id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </main>
            </div>
          ) : (
            <div>
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-600" />
                    {editingList ? "Edit Merit List" : "Create New Merit List"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the details below.
                  </p>
                  {user?.institute && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Users className="w-4 h-4 mr-1" />
                        Institute: {user.instituteName || user.institute}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={showListView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <List size={20} /> Back to List
                </button>
              </header>
              <main className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
                <MeritListForm
                  initialData={editingList}
                  onSubmit={handleSave}
                  onCancel={showListView}
                  isSubmitting={isSubmitting}
                  isSubAdmin={true}
                  instituteId={user?.institute}
                  instituteName={user?.instituteName}
                />
              </main>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubAdminMeritLists;
