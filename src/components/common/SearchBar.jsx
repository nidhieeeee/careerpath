import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Zap } from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import useDataStore from "../../store/useDataStore";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState({
    courses: [],
    institutes: [],
    articles: [],
  });
  const { performSearch } = useSearch();
  const { courses, institutes, articles } = useDataStore();
  const navigate = useNavigate();

  // Generate suggestions as user types
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions({ courses: [], institutes: [], articles: [] });
      return;
    }

    const q = query.toLowerCase();

    // Search across all categories
    const matchedCourses = (courses || [])
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.stream?.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedInstitutes = (institutes || [])
      .filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.location?.city?.toLowerCase().includes(q) ||
          i.location?.state?.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedArticles = (articles || [])
      .filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q)
      )
      .slice(0, 3);

    setSuggestions({
      courses: matchedCourses,
      institutes: matchedInstitutes,
      articles: matchedArticles,
    });
    setShowSuggestions(true);
  }, [query, courses, institutes, articles]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query.trim() === "") return;

    // Run the search using data from the global store
    try {
      await performSearch(query);
    } catch (err) {
      console.error("Search error:", err);
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (item, type) => {
    try {
      await performSearch(item.name || item.title);
    } catch (err) {
      console.error("Search error:", err);
    }

    // Navigate to detail page or search results
    if (type === "course") {
      navigate(`/courses?search=${encodeURIComponent(item.name)}`);
    } else if (type === "institute") {
      navigate(`/institutes?search=${encodeURIComponent(item.name)}`);
    } else if (type === "article") {
      navigate(`/articles?search=${encodeURIComponent(item.title)}`);
    }

    setQuery("");
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  const totalSuggestions =
    suggestions.courses.length +
    suggestions.institutes.length +
    suggestions.articles.length;

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center transition-all duration-300 bg-white rounded-full border ${
          isExpanded
            ? "w-full md:w-96 border-blue-400 shadow-lg"
            : "w-full md:w-64 border-gray-200"
        }`}
      >
        {isExpanded ? (
          <form onSubmit={handleSearch} className="w-full flex items-center">
            <Search className="ml-4 text-blue-500 h-5 w-5 flex-shrink-0" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search courses, colleges, articles..."
              className="w-full py-3 px-4 text-sm bg-transparent border-none focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions({ courses: [], institutes: [], articles: [] });
                  document.getElementById("search-input")?.focus();
                }}
                className="mr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
        ) : (
          <button
            onClick={toggleExpand}
            className="flex items-center justify-center md:justify-start w-full h-10 px-4 text-sm text-gray-500 focus:outline-none hover:text-blue-500 transition"
          >
            <Search className="h-5 w-5 flex-shrink-0" />
            <span className="hidden md:block ml-3">
              Search courses, colleges...
            </span>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isExpanded &&
        showSuggestions &&
        query.trim() !== "" &&
        totalSuggestions > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-w-md md:max-w-96">
            <div className="max-h-96 overflow-y-auto">
              {/* Courses */}
              {suggestions.courses.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Zap size={14} className="text-orange-500" /> Courses
                  </div>
                  <div className="space-y-2">
                    {suggestions.courses.map((course) => (
                      <button
                        key={course._id}
                        onClick={() => handleSuggestionClick(course, "course")}
                        className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 transition text-sm text-gray-700 hover:text-blue-600"
                      >
                        <div className="font-medium">{course.name}</div>
                        <div className="text-xs text-gray-500">
                          {course.stream} • {course.type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Institutes */}
              {suggestions.institutes.length > 0 && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Zap size={14} className="text-blue-600" /> Institutes
                  </div>
                  <div className="space-y-2">
                    {suggestions.institutes.map((institute) => (
                      <button
                        key={institute._id}
                        onClick={() =>
                          handleSuggestionClick(institute, "institute")
                        }
                        className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 transition text-sm text-gray-700 hover:text-blue-600"
                      >
                        <div className="font-medium">{institute.name}</div>
                        <div className="text-xs text-gray-500">
                          {institute.location?.city},{" "}
                          {institute.location?.state}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {suggestions.articles.length > 0 && (
                <div className="px-4 py-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Zap size={14} className="text-purple-600" /> Articles
                  </div>
                  <div className="space-y-2">
                    {suggestions.articles.map((article) => (
                      <button
                        key={article._id}
                        onClick={() =>
                          handleSuggestionClick(article, "article")
                        }
                        className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 transition text-sm text-gray-700 hover:text-blue-600"
                      >
                        <div className="font-medium">{article.title}</div>
                        <div className="text-xs text-gray-500">
                          {article.category}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View All Results Button */}
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={handleSearch}
                className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                View All Results for "{query}"
              </button>
            </div>
          </div>
        )}

      {/* No Results Message */}
      {isExpanded &&
        showSuggestions &&
        query.trim() !== "" &&
        totalSuggestions === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-w-md md:max-w-96 px-4 py-6 text-center">
            <p className="text-gray-500 text-sm">
              No results found for "{query}"
            </p>
            <button
              onClick={handleSearch}
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Search Anyway
            </button>
          </div>
        )}
    </div>
  );
};

export default SearchBar;
