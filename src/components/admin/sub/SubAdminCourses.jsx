import React, { useState, useEffect, useRef } from "react";
import useDataStore from "../../../store/useDataStore";
import { useCourses } from "../../../hooks/useCourses";
import SubAdminNavbar from "./SubAdminNavbar";
// import CourseGrid from "../CourseGrid";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubAdminCourses = () => {
  const { role, initializeAuth, isLoggedIn, user } = useDataStore();
  const { courses, loading, addCourse, updateCourse, deleteCourse } =
    useCourses();
  const navigate = useNavigate();

  const [view, setView] = useState("list");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
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

  // Filter courses by subadmin's institute
  useEffect(() => {
    if (courses && user?.institute) {
      const instituteCourses = courses.filter(
        (course) =>
          course.institute === user.institute ||
          course.instituteId === user.institute
      );
      setFilteredCourses(instituteCourses);
    } else {
      setFilteredCourses(courses || []);
    }
  }, [courses, user]);

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
    }
    setIsSubmitting(false);
  };

  const handleDelete = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteCourse(courseId);
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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-36">
        <div className="max-w-7xl mx-auto">
          {view === "list" ? (
            <div>
              <header className="flex items-center justify-between mb-8">
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
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <Plus size={20} /> Add Course
                </button>
              </header>

              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                        {filteredCourses.length}
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
                          filteredCourses.filter(
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
                        {
                          new Set(
                            filteredCourses.map((course) => course.category)
                          ).size
                        }
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
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No courses found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by adding your first course for this institute.
                    </p>
                    <button
                      onClick={() => showFormView()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Course
                    </button>
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
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill out the details below.
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
                  onClick={showListView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
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
