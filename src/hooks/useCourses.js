import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const useCourses = (instituteId = null) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${baseURL}/courses`;

      // If instituteId is provided, fetch courses for specific institute
      if (instituteId) {
        url = `${baseURL}/courses/institute/${instituteId}`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.courses || data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new course
  const addCourse = async (courseData) => {
    try {
      setLoading(true);

      // If instituteId is provided, add it to course data
      const submissionData = instituteId
        ? { ...courseData, instituteId, institute: instituteId }
        : courseData;

      const response = await fetch(`${baseURL}/courses`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add course");
      }

      const newCourse = await response.json();
      setCourses((prev) => [newCourse, ...prev]);
      toast.success("Course added successfully!");
      return true;
    } catch (err) {
      console.error("Error adding course:", err);
      toast.error(err.message || "Failed to add course");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (courseId, courseData) => {
    try {
      setLoading(true);

      // If instituteId is provided, ensure it's in the update data
      const submissionData = instituteId
        ? { ...courseData, instituteId, institute: instituteId }
        : courseData;

      const response = await fetch(`${baseURL}/courses/${courseId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update course");
      }

      const updatedCourse = await response.json();
      setCourses((prev) =>
        prev.map((course) => (course._id === courseId ? updatedCourse : course))
      );
      toast.success("Course updated successfully!");
      return true;
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error(err.message || "Failed to update course");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async (courseId) => {
    try {
      setLoading(true);

      const response = await fetch(`${baseURL}/courses/${courseId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error(err.message || "Failed to delete course");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find((course) => course._id === courseId);
  };

  // Get courses by category
  const getCoursesByCategory = (category) => {
    return courses.filter(
      (course) => course.category?.toLowerCase() === category?.toLowerCase()
    );
  };

  // Search courses
  const searchCourses = (searchTerm) => {
    if (!searchTerm) return courses;

    const term = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.name?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term) ||
        course.category?.toLowerCase().includes(term)
    );
  };

  // Get course statistics
  const getCourseStats = () => {
    const total = courses.length;
    const active = courses.filter(
      (course) => course.status === "active"
    ).length;
    const inactive = courses.filter(
      (course) => course.status === "inactive"
    ).length;
    const categories = new Set(courses.map((course) => course.category)).size;

    return {
      total,
      active,
      inactive,
      categories,
    };
  };

  // Fetch courses on mount and when instituteId changes
  useEffect(() => {
    fetchCourses();
  }, [instituteId]);

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCoursesByCategory,
    searchCourses,
    getCourseStats,
    refreshCourses: fetchCourses,
  };
};

// Hook specifically for SubAdmin (gets instituteId from user context)
export const useSubAdminCourses = () => {
  // You can get instituteId from your auth context/store
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const instituteId = user.institute || user.instituteId;

  return useCourses(instituteId);
};
