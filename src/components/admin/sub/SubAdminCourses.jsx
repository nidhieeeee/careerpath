import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../../store/useDataStore";
import { useCourses } from "../../../hooks/useCourses";
import SubAdminNavbar from "./SubAdminNavbar";
import CourseForm from "../CourseForm";
import UnauthorizedAccess from "../UnauthorizedAccess";
import {
  Plus,
  List,
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  Award,
  MapPin,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubAdminCourses = () => {
  const { role, initializeAuth, isLoggedIn, user } = useDataStore();
  const {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    fetchCourses,
  } = useCourses();
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const topRef = useRef(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch courses when component mounts or user changes
  useEffect(() => {
    if (isLoggedIn && user?.institute) {
      fetchCourses();
    }
  }, [isLoggedIn, user, fetchCourses]);

  // Filter courses by subadmin's institute and search/filter criteria
  useEffect(() => {
    let filtered = courses || [];

    // Filter by institute for subadmin
    if (user?.institute) {
      filtered = filtered.filter(
        (course) =>
          course.institute === user.institute ||
          course.instituteId === user.institute
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (course) =>
          course.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply level filter
    if (selectedLevel) {
      filtered = filtered.filter(
        (course) => course.level?.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(
        (course) =>
          course.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredCourses(filtered);
  }, [
    courses,
    user,
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedStatus,
  ]);

  // Get unique categories, levels, and statuses for filter options
  const instituteCourses =
    courses?.filter(
      (course) =>
        course.institute === user?.institute ||
        course.instituteId === user?.institute
    ) || [];

  const categories = [
    ...new Set(
      instituteCourses.map((course) => course.category).filter(Boolean)
    ),
  ];
  const levels = [
    ...new Set(instituteCourses.map((course) => course.level).filter(Boolean)),
  ];
  const statuses = [
    ...new Set(instituteCourses.map((course) => course.status).filter(Boolean)),
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSelectedStatus("");
  };

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

    // Add institute information to form data for subadmin
    const submissionData = {
      ...formData,
      institute: user?.institute || formData.institute,
      instituteId: user?.institute || formData.instituteId,
      createdBy: user?.id || user?._id,
    };

    let success = false;
    if (editingCourse) {
      success = await updateCourse(editingCourse._id, submissionData);
    } else {
      success = await addCourse(submissionData);
    }
    if (success) {
      showListView();
      // Refresh courses after successful save
      fetchCourses();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const success = await deleteCourse(courseId);
      if (success) {
        // Refresh courses after successful delete
        fetchCourses();
      }
    }
  };

  const getCourseIcon = (courseType) => {
    switch (courseType?.toLowerCase()) {
      case "engineering":
      case "technology":
        return GraduationCap;
      case "medical":
      case "medicine":
        return Award;
      case "business":
      case "management":
        return Users;
      case "arts":
      case "humanities":
      case "design":
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  if (role === null) {
    return <div className="min-h-screen bg-gray-50" ref={topRef} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
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
        className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
        style={{ paddingTop: "8rem" }}
        ref={topRef}
      >
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            <div>
              <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    Course Management
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Create, edit, and manage courses for your institute.
                  </p>
                  {user?.institute && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <MapPin className="w-4 h-4 mr-1" />
                        Institute: {user.instituteName || user.institute}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => showFormView()}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  <Plus size={20} /> Add Course
                </button>
              </header>

              {/* Search and Filter Section */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search courses by name, category, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Levels</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm ||
                  selectedCategory ||
                  selectedLevel ||
                  selectedStatus) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory("")}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {selectedLevel && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        Level: {selectedLevel}
                        <button
                          onClick={() => setSelectedLevel("")}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {selectedStatus && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                        Status: {selectedStatus}
                        <button
                          onClick={() => setSelectedStatus("")}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Total Courses
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {instituteCourses.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Active Programs
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          instituteCourses.filter(
                            (course) => course.status === "active"
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Categories
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {categories.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Search className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Filtered Results
                      </h3>
                      <p className="text-2xl font-bold text-orange-600">
                        {filteredCourses.length}
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
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {searchTerm ||
                      selectedCategory ||
                      selectedLevel ||
                      selectedStatus
                        ? "No courses match your search criteria"
                        : "No courses found"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm ||
                      selectedCategory ||
                      selectedLevel ||
                      selectedStatus
                        ? "Try adjusting your search terms or filters."
                        : "Start by adding your first course for this institute."}
                    </p>
                    {!(
                      searchTerm ||
                      selectedCategory ||
                      selectedLevel ||
                      selectedStatus
                    ) && (
                      <button
                        onClick={() => showFormView()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Course
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                      const CourseIcon = getCourseIcon(course.category);
                      return (
                        <div
                          key={course._id}
                          className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <CourseIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                    {course.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {course.category}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {course.description || "No description available"}
                            </p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-2" />
                                Duration: {course.duration || "Not specified"}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Award className="w-4 h-4 mr-2" />
                                Level: {course.level || "Not specified"}
                              </div>
                              {course.fees && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <span className="w-4 h-4 mr-2">₹</span>
                                  Fees: {course.fees}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  course.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {course.status || "Active"}
                              </span>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => showFormView(course)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(course._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </main>
            </div>
          ) : (
            <div>
              <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the details below.
                  </p>
                </div>
                <button
                  onClick={showListView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors whitespace-nowrap"
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

export default SubAdminCourses;
