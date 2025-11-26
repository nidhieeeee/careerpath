import React, { useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import ExamCard from "../components/exams/ExamCard";
import { SearchFilter, ActiveFilters } from "../components/common/FilterPanel";
import { useSearch } from "../hooks/useFilteredData";
import { examsData } from "../data/mockData";

const ExamsPage = () => {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: "all",
    month: "",
    level: "",
  });

  const { searchResults, searchTerm, updateSearchTerm, clearSearch } =
    useSearch(examsData, ["name", "description", "type"], 300);

  const filteredExams = searchResults
    .filter((exam) =>
      filters.category === "all"
        ? true
        : exam.type.toLowerCase() === filters.category
    )
    .filter((exam) =>
      filters.month ? exam.month?.toLowerCase() === filters.month : true
    )
    .filter((exam) =>
      filters.level ? exam.level?.toLowerCase() === filters.level : true
    );

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ category: "all", month: "", level: "" });
    clearSearch();
  };

  const hasActiveFilters =
    filters.category !== "all" || filters.month || filters.level || searchTerm;

  const monthOptions = [
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
  ];

  const levelOptions = [
    { value: "national", label: "National" },
    { value: "state", label: "State" },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Government & Entrance Exams 2025
          </h1>
          <p className="text-blue-100">
            Stay updated with the latest and upcoming government and competitive
            entrance exams.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <SearchFilter
          value={searchTerm}
          onChange={updateSearchTerm}
          placeholder="Search exams by name, type..."
          className="max-w-md"
        />
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 pb-4">
        <div className="md:flex md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {["all", "government exam", "entrance exam"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange("category", cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === cat
                    ? "bg-blue-800 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat === "all"
                  ? "All Exams"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                  Month
                </label>
                <select
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Months</option>
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange("level", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  {levelOptions.map((opt) => (
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
                category: filters.category !== "all" ? filters.category : "",
                month: filters.month,
                level: filters.level,
              }}
              filterLabels={{
                category: "Category",
                month: "Month",
                level: "Level",
              }}
              onRemoveFilter={(key) =>
                handleFilterChange(key, key === "category" ? "all" : "")
              }
              onClearAll={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* Exam Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredExams.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No exams found for the selected filters.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Showing {filteredExams.length} of {examsData.length} exams
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
