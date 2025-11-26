import React, { useEffect, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import { SearchFilter, ActiveFilters } from "../components/common/FilterPanel";
import { useFilteredData, useSearch } from "../hooks/useFilteredData";
import useDataStore from "../store/useDataStore";

const CoursesPage = () => {
  const { courses, fetchCourses, loading } = useDataStore();
  const [showFilters, setShowFilters] = useState(false);

  const courseTypes = ["all", "UG", "PG", "Diploma"];
  const streamOptions = [
    { value: "science", label: "Science" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts" },
  ];
  const durationOptions = [
    { value: "1-2", label: "1-2 Years" },
    { value: "3-4", label: "3-4 Years" },
    { value: "5+", label: "5+ Years" },
  ];

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const {
    filteredData: searchResults,
    searchTerm,
    updateSearchTerm,
    clearSearch,
  } = useSearch(courses, ["name", "description", "stream"], 300);

  const [filters, setFilters] = useState({
    type: "all",
    stream: "",
    duration: "",
  });

  const filterByDuration = (courseDuration, durationFilter) => {
    if (durationFilter === "1-2")
      return courseDuration?.includes("1") || courseDuration?.includes("2");
    if (durationFilter === "3-4")
      return courseDuration?.includes("3") || courseDuration?.includes("4");
    if (durationFilter === "5+") return parseInt(courseDuration) >= 5;
    return true;
  };

  const filteredCourses = searchResults
    .filter((course) =>
      filters.type === "all" ? true : course.type === filters.type
    )
    .filter((course) =>
      filters.stream ? course.stream?.toLowerCase() === filters.stream : true
    )
    .filter((course) =>
      filters.duration
        ? filterByDuration(course.duration, filters.duration)
        : true
    );

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ type: "all", stream: "", duration: "" });
    clearSearch();
  };

  const hasActiveFilters =
    filters.stream || filters.duration || filters.type !== "all";

  const filterLabels = {
    type: "Type",
    stream: "Stream",
    duration: "Duration",
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Explore All Courses
          </h1>
          <p className="text-blue-100">
            Discover a wide range of courses across different streams and levels
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <SearchFilter
          value={searchTerm}
          onChange={updateSearchTerm}
          placeholder="Search courses by name, stream..."
          className="max-w-md"
        />
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 pb-4">
        <div className="md:flex md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {courseTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("type", type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.type === type
                    ? "bg-blue-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "all" ? "All Courses" : type}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-1" />
            More Filters
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stream
                </label>
                <select
                  value={filters.stream}
                  onChange={(e) => handleFilterChange("stream", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Streams</option>
                  {streamOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) =>
                    handleFilterChange("duration", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Duration</option>
                  {durationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4">
            <ActiveFilters
              filters={{
                type: filters.type !== "all" ? filters.type : "",
                stream: filters.stream,
                duration: filters.duration,
              }}
              filterLabels={filterLabels}
              onRemoveFilter={(key) =>
                handleFilterChange(key, key === "type" ? "all" : "")
              }
              onClearAll={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-10 text-gray-600">
            Loading courses...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No courses found for the selected filters.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
