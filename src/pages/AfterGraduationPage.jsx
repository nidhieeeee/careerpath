
import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import useDataStore from "../store/useDataStore";

const AfterGraduationPage = () => {
  const [activeStream, setActiveStream] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    duration: "",
    specialization: "",
    popularity: "",
  });

  const { courses, fetchCourses, loading } = useDataStore();

  useEffect(() => {
    if (!courses || courses.length === 0) {
      fetchCourses();
    }
  }, [courses, fetchCourses]);

  // Only PG courses
  const relevantCourses = useMemo(
    () => (courses || []).filter((course) => course.type === "PG"),
    [courses]
  );

  // Popularity options from data
  const popularityOptions = useMemo(() => {
    const set = new Set();
    relevantCourses.forEach((c) => {
      if (c.popularity) set.add(c.popularity.toString().trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [relevantCourses]);

  // Smart stream matcher (Science / Commerce / Arts)
  const isCourseInStream = (course, stream) => {
    if (stream === "all") return true;

    const name = course.name?.toLowerCase() || "";
    const courseStream = course.stream?.toLowerCase() || "";
    const tags = `${name} ${courseStream}`;

    if (stream === "science") {
      const scienceKeywords = [
        "science",
        "m.sc",
        "msc",
        "m.tech",
        "mtech",
        " me ",
        " ms ",
        "engineering",
        "data science",
        "computer science",
        "physics",
        "chemistry",
        "maths",
        "mathematics",
        "biology",
        "biotech",
        "biotechnology",
        "pharmacy",
        "pharm",
        "medical",
        "nursing",
        "clinical",
      ];
      return scienceKeywords.some((kw) => tags.includes(kw));
    }

    if (stream === "commerce") {
      const commerceKeywords = [
        "commerce",
        "m.com",
        "mcom",
        "mba",
        "pgdm",
        "finance",
        "accounting",
        "accounts",
        "banking",
        "taxation",
        "economics",
        "business administration",
        "management",
      ];
      return commerceKeywords.some((kw) => tags.includes(kw));
    }

    if (stream === "arts") {
      const artsKeywords = [
        "arts",
        "m.a",
        "ma ",
        "ma (",
        "humanities",
        "history",
        "political science",
        "sociology",
        "literature",
        "english",
        "psychology",
        "philosophy",
        "social work",
        "msw",
        "fine arts",
        "design",
        "mass communication",
        "journalism",
      ];
      return artsKeywords.some((kw) => tags.includes(kw));
    }

    return true;
  };

  // Duration filter
  const matchesDuration = (course, durationFilter) => {
    if (!durationFilter) return true;
    if (!course.duration) return false;

    const num = parseInt(course.duration, 10);
    if (Number.isNaN(num)) return false;

    if (durationFilter === "1-2") return num >= 1 && num <= 2;
    if (durationFilter === "3-4") return num >= 3 && num <= 4;
    return true;
  };

  // Popularity filter
  const matchesPopularity = (course, popularityFilter) => {
    if (!popularityFilter) return true;
    if (!course.popularity) return false;
    return (
      course.popularity.toString().trim().toLowerCase() ===
      popularityFilter.toLowerCase()
    );
  };

  // Specialization filter
  const matchesSpecialization = (course, specialization) => {
    if (!specialization) return true;

    const name = course.name?.toLowerCase() || "";
    const courseStream = course.stream?.toLowerCase() || "";
    const tags = `${name} ${courseStream}`;

    if (specialization === "tech") {
      const techKeywords = [
        "technology",
        "engineering",
        "computer",
        "it",
        "information technology",
        "data science",
        "software",
        "ai",
        "artificial intelligence",
        "machine learning",
        "cyber security",
      ];
      return techKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "mgmt") {
      const mgmtKeywords = [
        "management",
        "mba",
        "pgdm",
        "business",
        "hr",
        "human resources",
        "marketing",
        "finance",
        "operations",
        "supply chain",
      ];
      return mgmtKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "science") {
      const sciKeywords = [
        "m.sc",
        "msc",
        "science",
        "physics",
        "chemistry",
        "biology",
        "biotech",
        "biotechnology",
        "mathematics",
        "maths",
      ];
      return sciKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "arts") {
      const artsKeywords = [
        "arts",
        "m.a",
        "ma ",
        "humanities",
        "history",
        "political science",
        "sociology",
        "literature",
        "english",
        "journalism",
        "mass communication",
        "fine arts",
        "design",
        "psychology",
        "social work",
      ];
      return artsKeywords.some((kw) => tags.includes(kw));
    }

    return true;
  };

  const filteredCourses = relevantCourses
    .filter((course) => isCourseInStream(course, activeStream))
    .filter((course) => matchesDuration(course, filters.duration))
    .filter((course) => matchesPopularity(course, filters.popularity))
    .filter((course) => matchesSpecialization(course, filters.specialization));

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      duration: "",
      specialization: "",
      popularity: "",
    });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            After Graduation: What's Next?
          </h1>
          <p className="text-blue-100">
            Explore post-graduate courses and career advancement opportunities
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="md:flex md:items-center md:justify-between">
          {/* Stream pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {["all", "science", "commerce", "arts"].map((stream) => (
              <button
                key={stream}
                onClick={() => setActiveStream(stream)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeStream === stream
                    ? "bg-blue-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {stream === "all"
                  ? "All Streams"
                  : stream.charAt(0).toUpperCase() + stream.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) =>
                    handleFilterChange("duration", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any Duration</option>
                  <option value="1-2">1-2 Years</option>
                  <option value="3-4">3-4 Years</option>
                </select>
              </div>

              {/* Popularity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Popularity
                </label>
                <select
                  value={filters.popularity}
                  onChange={(e) =>
                    handleFilterChange("popularity", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any</option>
                  {popularityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) =>
                    handleFilterChange("specialization", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any Specialization</option>
                  <option value="tech">Technology</option>
                  <option value="mgmt">Management</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts & Humanities</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Clear Filters
              </button>
              <button className="px-4 py-2 bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-900">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-6">
        {loading && (!courses || courses.length === 0) ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Career paths section – keep your existing JSX here */}
            {/* Career Paths Section (unchanged) */}
      <div className="container mx-auto px-4 py-8 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Popular Career Paths After Graduation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">
              Higher Education
            </h3>
            <p className="text-gray-600 mb-4">
              Pursue advanced degrees like Masters or PhD to specialize in your
              field and gain deeper knowledge. Ideal for academic and
              research-oriented careers.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                M.Tech
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                MBA
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                MSc
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                PhD
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">
              Professional Certifications
            </h3>
            <p className="text-gray-600 mb-4">
              Short-term, industry-focused certifications that enhance your
              skills and employability. Perfect for quick career advancement in
              specific domains.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Project Management
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Digital Marketing
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Data Science
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">
              Job Market
            </h3>
            <p className="text-gray-600 mb-4">
              Enter the workforce directly with your undergraduate degree. Gain
              practical experience and build your career through on-the-job
              learning.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Entry-level Positions
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Management Trainee
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Associate Roles
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">
              Entrepreneurship
            </h3>
            <p className="text-gray-600 mb-4">
              Start your own business venture using the knowledge and skills
              acquired during your undergraduate studies. Be your own boss and
              create employment opportunities.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Startups
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Freelancing
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Consulting
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterGraduationPage;
