import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import { SearchFilter, ActiveFilters } from "../components/common/FilterPanel";
import { useSearch } from "../hooks/useFilteredData";
import useDataStore from "../store/useDataStore";

const CoursesPage = () => {
  const { courses, fetchCourses, loading } = useDataStore();
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    type: "all",
    stream: "",
    duration: "",
  });

  // Fetch courses on mount
  useEffect(() => {
    if (!courses || courses.length === 0) {
      fetchCourses();
    }
  }, [courses, fetchCourses]);

  // ---- SEARCH: useSearch with safe fallback ----
  const {
    filteredData: searchResultsRaw,
    searchTerm,
    updateSearchTerm,
    clearSearch,
  } = useSearch(courses || [], ["name", "description", "stream"], 300);

  // If search has no results (initial / empty term), show all courses
  const searchResults =
    searchResultsRaw && searchResultsRaw.length ? searchResultsRaw : courses || [];

  // ---- Dynamic, alphabetically sorted filter options from data ----

  // Course types from data: e.g., "UG", "PG", "Diploma" etc.
  const courseTypes = useMemo(() => {
    const set = new Set();
    (courses || []).forEach((c) => {
      if (c.type) set.add(c.type.toString());
    });
    const sortedTypes = Array.from(set).sort((a, b) =>
      a.localeCompare(b)
    );
    return ["all", ...sortedTypes]; // keep "all" at start
  }, [courses]);

  // Streams from data: (stream field)
  const streamOptions = useMemo(() => {
    const set = new Set();
    (courses || []).forEach((c) => {
      if (c.stream) set.add(c.stream.toString().trim());
    });
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((stream) => ({
        value: stream.toLowerCase(),
        label: stream,
      }));
  }, [courses]);

  // Duration filters stay as buckets but already in logical order
  const durationOptions = [
    { value: "1-2", label: "1-2 Years" },
    { value: "3-4", label: "3-4 Years" },
    { value: "5+", label: "5+ Years" },
  ];

  // ---- Duration filter helper ----
  const filterByDuration = (courseDuration, durationFilter) => {
    if (!durationFilter) return true;
    if (!courseDuration) return false;

    // Normalize duration string: e.g., "4 Years", "3 Yr", "2" etc.
    const num = parseInt(courseDuration, 10);
    if (Number.isNaN(num)) return false;

    if (durationFilter === "1-2") return num >= 1 && num <= 2;
    if (durationFilter === "3-4") return num >= 3 && num <= 4;
    if (durationFilter === "5+") return num >= 5;
    return true;
  };

  // ---- APPLY FILTERS ----
  const filteredCourses = (searchResults || [])
    // Type filter (UG / PG / Diploma etc.)
    .filter((course) =>
      filters.type === "all" ? true : course.type === filters.type
    )
    // Stream filter
    .filter((course) =>
      filters.stream
        ? course.stream?.toString().toLowerCase() === filters.stream
        : true
    )
    // Duration filter
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

  // ---- LOADING STATE ----
  if (loading && (!courses || courses.length === 0)) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-600 text-lg font-semibold">
            Loading courses, please wait...
          </p>
        </div>
      </div>
    );
  }

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
      {/* <div className="container mx-auto px-4 py-4">
        <SearchFilter
          value={searchTerm}
          onChange={updateSearchTerm}
          placeholder="Search courses by name, stream..."
          className="max-w-md"
        />
      </div> */}

      {/* Filters */}
      <div className="container mx-auto px-4 pb-4">
        <div className="md:flex md:items-center md:justify-between gap-4">
          {/* Course Type Pills */}
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

          {/* More Filters Button */}
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
              {/* Stream Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stream
                </label>
                <select
                  value={filters.stream}
                  onChange={(e) =>
                    handleFilterChange("stream", e.target.value)
                  }
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

              {/* Duration Filter */}
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
        {loading && filteredCourses.length === 0 ? (
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
              Showing {filteredCourses.length} of {courses?.length || 0} courses
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
