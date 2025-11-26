import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import useDataStore from "../store/useDataStore";

const After12thPage = () => {
  const [activeStream, setActiveStream] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    duration: "",
    courseType: "",
    specialization: "",
    popularity: "",
  });

  const { courses, fetchCourses, loading } = useDataStore();

  useEffect(() => {
    if (!courses || courses.length === 0) {
      fetchCourses();
    }
  }, [courses, fetchCourses]);

  // Only UG or Diploma courses are relevant here
  const relevantCourses = useMemo(
    () =>
      (courses || []).filter(
        (course) => course.type === "UG" || course.type === "Diploma"
      ),
    [courses]
  );

  // Dynamic popularity options from data
  const popularityOptions = useMemo(() => {
    const set = new Set();
    relevantCourses.forEach((c) => {
      if (c.popularity) set.add(c.popularity.toString().trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [relevantCourses]);

  // Smart stream matching: Science should show Engg, Medical, Pharmacy, BSc, etc.
  const isCourseInStream = (course, stream) => {
    if (stream === "all") return true;

    const name = course.name?.toLowerCase() || "";
    const courseStream = course.stream?.toLowerCase() || "";
    const tags = `${name} ${courseStream}`;

    if (stream === "science") {
      const scienceKeywords = [
        "science",
        "engineering",
        "b.tech",
        "btech",
        " be ",
        "mechanical",
        "civil",
        "electrical",
        "electronics",
        "computer",
        "cs ",
        "it ",
        "information technology",
        "mbbs",
        "bds",
        "medical",
        "pharmacy",
        "b.pharm",
        "bpharm",
        "b.sc",
        "bsc",
        "biotech",
        "biotechnology",
        "nursing",
        "physiotherapy",
      ];
      return scienceKeywords.some((kw) => tags.includes(kw));
    }

    if (stream === "commerce") {
      const commerceKeywords = [
        "commerce",
        "b.com",
        "bcom",
        "bba",
        "bbm",
        "finance",
        "accounting",
        "accounts",
        "banking",
        "taxation",
        "economics",
        "business administration",
        "management",
        "ca ",
        "chartered accountant",
        "company secretary",
        "cs ",
        "cma",
      ];
      return commerceKeywords.some((kw) => tags.includes(kw));
    }

    if (stream === "arts") {
      const artsKeywords = [
        "arts",
        "b.a",
        "ba ",
        "fine arts",
        "design",
        "fashion",
        "social work",
        "psychology",
        "history",
        "political science",
        "sociology",
        "literature",
        "journalism",
        "mass communication",
        "performing arts",
      ];
      return artsKeywords.some((kw) => tags.includes(kw));
    }

    return true;
  };

  // Duration filter – assumes duration like "3 Years" / "2 Yr" / "4"
  const matchesDuration = (course, durationFilter) => {
    if (!durationFilter) return true;
    if (!course.duration) return false;

    const num = parseInt(course.duration, 10);
    if (Number.isNaN(num)) return false;

    if (durationFilter === "1-2") return num >= 1 && num <= 2;
    if (durationFilter === "3-4") return num >= 3 && num <= 4;
    if (durationFilter === "5+") return num >= 5;
    return true;
  };

  // Course type filter – UG / Diploma
  const matchesCourseType = (course, courseTypeFilter) => {
    if (!courseTypeFilter) return true;
    const type = course.type?.toLowerCase() || "";
    if (courseTypeFilter === "ug") return type === "ug";
    if (courseTypeFilter === "diploma") return type === "diploma";
    return true;
  };

  // Popularity filter – matches exact popularity string
  const matchesPopularity = (course, popularityFilter) => {
    if (!popularityFilter) return true;
    if (!course.popularity) return false;
    return (
      course.popularity.toString().trim().toLowerCase() ===
      popularityFilter.toLowerCase()
    );
  };

  // Extra filter: Career Focus / Specialization
  const matchesSpecialization = (course, specialization) => {
    if (!specialization) return true;

    const name = course.name?.toLowerCase() || "";
    const courseStream = course.stream?.toLowerCase() || "";
    const tags = `${name} ${courseStream}`;

    if (specialization === "engg") {
      const enggKeywords = [
        "engineering",
        "b.tech",
        "btech",
        " be ",
        "mechanical",
        "civil",
        "electrical",
        "electronics",
        "computer",
        "cs ",
        "it ",
        "information technology",
      ];
      return enggKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "medical") {
      const medicalKeywords = [
        "mbbs",
        "bds",
        "medical",
        "nursing",
        "physiotherapy",
        "ayurveda",
        "homeopathy",
        "bhms",
        "bams",
        "bpt",
        "pharmacy",
      ];
      return medicalKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "commerce") {
      const commerceKeywords = [
        "b.com",
        "bcom",
        "bba",
        "bbm",
        "finance",
        "banking",
        "account",
        "accounting",
        "economics",
        "business",
        "management",
      ];
      return commerceKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "design") {
      const designKeywords = [
        "design",
        "fashion",
        "interior",
        "ux",
        "ui",
        "graphic",
        "animation",
        "multimedia",
        "fine arts",
      ];
      return designKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "law") {
      const lawKeywords = ["llb", "ba llb", "bba llb", "law"];
      return lawKeywords.some((kw) => tags.includes(kw));
    }

    if (specialization === "arts") {
      const artsKeywords = [
        "b.a",
        "ba ",
        "history",
        "political science",
        "sociology",
        "psychology",
        "english",
        "literature",
        "journalism",
        "mass communication",
        "social work",
      ];
      return artsKeywords.some((kw) => tags.includes(kw));
    }

    return true;
  };

  const filteredCourses = relevantCourses
    .filter((course) => isCourseInStream(course, activeStream))
    .filter((course) => matchesDuration(course, filters.duration))
    .filter((course) => matchesCourseType(course, filters.courseType))
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
      courseType: "",
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
            After 12th: What's Next?
          </h1>
          <p className="text-blue-100">
            Explore courses and career paths based on your stream
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <option value="5+">5+ Years</option>
                </select>
              </div>

              {/* Course Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Type
                </label>
                <select
                  value={filters.courseType}
                  onChange={(e) =>
                    handleFilterChange("courseType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any Type</option>
                  <option value="ug">Undergraduate (UG)</option>
                  <option value="diploma">Diploma</option>
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

              {/* Career Focus / Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Career Focus
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) =>
                    handleFilterChange("specialization", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any</option>
                  <option value="engg">Engineering / Tech</option>
                  <option value="medical">Medical & Health</option>
                  <option value="commerce">Commerce & Business</option>
                  <option value="design">Design & Creative</option>
                  <option value="law">Law</option>
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

            {/* FAQ Section (unchanged) */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              What are the best career options after 12th Science?
            </h3>
            <p className="text-gray-600">
              After 12th Science, popular options include Engineering
              (B.Tech/B.E), Medical (MBBS/BDS), B.Sc, Architecture, Pharmacy,
              and various other specialized courses. Your choice should align
              with your interests, aptitude, and career goals.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Should I choose a diploma or a degree course?
            </h3>
            <p className="text-gray-600">
              Diplomas are shorter, more practical, and get you into the
              workforce quicker. Degrees are longer but provide deeper
              theoretical knowledge and better long-term career prospects. Your
              choice depends on your immediate goals and career plans.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              How important are entrance exams after 12th?
            </h3>
            <p className="text-gray-600">
              For many professional courses like Engineering (JEE) and Medical
              (NEET), entrance exams are mandatory and extremely important. Your
              rank in these competitive exams determines the quality of
              institution you can get admitted to, which significantly impacts
              your career prospects.
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default After12thPage;