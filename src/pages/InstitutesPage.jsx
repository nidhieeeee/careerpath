import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import InstituteCard from "../components/institutes/InstituteCard";
import { SearchFilter, ActiveFilters } from "../components/common/FilterPanel";
import { useSearch } from "../hooks/useFilteredData";
import useDataStore from "../store/useDataStore";

const InstitutesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { institutes, fetchInstitutes, loading } = useDataStore();

  const [filters, setFilters] = useState({
    state: "",
    city: "",
    courseType: "",
    affiliation: "",
    financeType: "",
    feeRange: "",
    naacGrade: "",
    nirfRanked: "",
    topOnly: false,
  });

  // Fetch institutes initially
  useEffect(() => {
    if (institutes.length === 0) fetchInstitutes();
  }, [institutes.length, fetchInstitutes]);

  // Search hook – fall back to full list if search is empty
  const {
    filteredData: searchedInstitutesRaw,
    searchTerm,
    updateSearchTerm,
    clearSearch,
  } = useSearch(institutes, ["name"], 300);

  const searchedInstitutes =
    searchedInstitutesRaw && searchedInstitutesRaw.length
      ? searchedInstitutesRaw
      : institutes;

    // ---------- OPTIONS FROM DATA (dynamic + alphabetically sorted) ----------

    const stateOptions = useMemo(() => {
      const set = new Set();
      institutes.forEach((i) => {
        if (i.location?.state) set.add(i.location.state.trim());
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [institutes]);

    const cityOptions = useMemo(() => {
      const set = new Set();
      institutes.forEach((i) => {
        if (i.location?.city) set.add(i.location.city.trim());
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [institutes]);

    const affiliationOptions = useMemo(() => {
      const set = new Set();
      institutes.forEach((i) => {
        if (i.affilication) set.add(i.affilication.trim());
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [institutes]);

    const naacOptions = useMemo(() => {
      const set = new Set();
      institutes.forEach((i) => {
        i.rankings?.naac?.forEach((r) => {
          if (r.grade) set.add(r.grade.trim());
        });
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [institutes]);

    const courseTypeOptions = useMemo(() => {
      const set = new Set();
      institutes.forEach((i) => {
        i.courses?.forEach((c) => {
          if (c.name) set.add(c.name.trim());
        });
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [institutes]);

    const financeTypeOptions = useMemo(() => {
      const set = new Set();
      institutes.forEach((i) => {
        i.courses?.forEach((c) => {
          if (c.finance_type) set.add(c.finance_type.trim());
        });
      });
      return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [institutes]);


  // ---------- FILTER LOGIC ----------

  const matchesFeeRange = (inst, feeRange) => {
    if (!feeRange) return true;

    const fees =
      inst.courses
        ?.map((c) => c.fees)
        .filter((f) => typeof f === "number") || [];

    if (!fees.length) return false;

    const minFee = Math.min(...fees);

    switch (feeRange) {
      case "Below ₹50,000":
        return minFee < 50000;
      case "₹50,000 – ₹1,00,000":
        return minFee >= 50000 && minFee <= 100000;
      case "₹1,00,000 – ₹2,00,000":
        return minFee > 100000 && minFee <= 200000;
      case "Above ₹2,00,000":
        return minFee > 200000;
      default:
        return true;
    }
  };

  const filteredInstitutes = searchedInstitutes
    .filter((inst) => {
      if (!filters.state) return true;
      const instState = inst.location?.state;
      return (
        instState &&
        instState.toLowerCase() === filters.state.toLowerCase()
      );
    })
    .filter((inst) => {
      if (!filters.city) return true;
      const instCity = inst.location?.city;
      return (
        instCity &&
        instCity.toLowerCase() === filters.city.toLowerCase()
      );
    })
    .filter((inst) => {
      if (!filters.courseType) return true;
      return inst.courses?.some(
        (c) => c.name && c.name === filters.courseType
      );
    })
    .filter((inst) => {
      if (!filters.affiliation) return true;
      const aff = inst.affilication;
      return (
        aff &&
        aff.toLowerCase() === filters.affiliation.toLowerCase()
      );
    })
    .filter((inst) => {
      if (!filters.financeType) return true;
      return inst.courses?.some(
        (c) =>
          c.finance_type &&
          c.finance_type.toLowerCase() ===
            filters.financeType.toLowerCase()
      );
    })
    .filter((inst) => matchesFeeRange(inst, filters.feeRange))
    .filter((inst) => {
      if (!filters.naacGrade) return true;
      return inst.rankings?.naac?.some(
        (r) =>
          r.grade &&
          r.grade.toLowerCase() === filters.naacGrade.toLowerCase()
      );
    })
    .filter((inst) => {
      if (!filters.nirfRanked) return true;
      const hasNirf = inst.rankings?.nirf?.length > 0;
      if (filters.nirfRanked === "Has NIRF Rank") return hasNirf;
      if (filters.nirfRanked === "No NIRF Rank") return !hasNirf;
      return true;
    })
    .filter((inst) => (filters.topOnly ? inst.isTopInstitute === true : true));

  // ---------- HELPERS ----------

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      state: "",
      city: "",
      courseType: "",
      affiliation: "",
      financeType: "",
      feeRange: "",
      naacGrade: "",
      nirfRanked: "",
      topOnly: false,
    });
    clearSearch();
  };

  const hasActiveFilters =
    !!searchTerm ||
    Object.entries(filters).some(([key, value]) =>
      key === "topOnly" ? value === true : value !== ""
    );

  // ---------- LOADING STATE ----------

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 text-lg font-semibold">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  // ---------- UI ----------

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Top Educational Institutes
          </h1>
          <p className="text-blue-100">
            Find the best colleges and universities for your career goals
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <SearchFilter
          value={searchTerm}
          onChange={updateSearchTerm}
          placeholder="Search institutes by name..."
          className="max-w-md"
        />
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-700">
            {filteredInstitutes.length} institutes found
          </h3>
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) =>
                    handleFilterChange("state", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) =>
                    handleFilterChange("city", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course (from courses.name) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  value={filters.courseType}
                  onChange={(e) =>
                    handleFilterChange("courseType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Courses</option>
                  {courseTypeOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {/* Affiliation (affilication) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation
                </label>
                <select
                  value={filters.affiliation}
                  onChange={(e) =>
                    handleFilterChange("affiliation", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Affiliation</option>
                  {affiliationOptions.map((aff) => (
                    <option key={aff} value={aff}>
                      {aff}
                    </option>
                  ))}
                </select>
              </div>

              {/* Finance Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finance Type
                </label>
                <select
                  value={filters.financeType}
                  onChange={(e) =>
                    handleFilterChange("financeType", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {financeTypeOptions.map((ft) => (
                    <option key={ft} value={ft}>
                      {ft}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Fee (per year)
                </label>
                <select
                  value={filters.feeRange}
                  onChange={(e) =>
                    handleFilterChange("feeRange", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="Below ₹50,000">Below ₹50,000</option>
                  <option value="₹50,000 – ₹1,00,000">
                    ₹50,000 – ₹1,00,000
                  </option>
                  <option value="₹1,00,000 – ₹2,00,000">
                    ₹1,00,000 – ₹2,00,000
                  </option>
                  <option value="Above ₹2,00,000">Above ₹2,00,000</option>
                </select>
              </div>

              {/* NAAC Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NAAC Grade
                </label>
                <select
                  value={filters.naacGrade}
                  onChange={(e) =>
                    handleFilterChange("naacGrade", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {naacOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* NIRF Ranked */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIRF Ranking
                </label>
                <select
                  value={filters.nirfRanked}
                  onChange={(e) =>
                    handleFilterChange("nirfRanked", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="Has NIRF Rank">Has NIRF Rank</option>
                  <option value="No NIRF Rank">No NIRF Rank</option>
                </select>
              </div>

              {/* Top Institutes only */}
              <div className="flex items-center mt-2 md:mt-6">
                <input
                  id="topOnly"
                  type="checkbox"
                  checked={filters.topOnly}
                  onChange={(e) =>
                    handleFilterChange("topOnly", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="topOnly"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Show only Top Institutes
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4">
            <ActiveFilters
              filters={{
                state: filters.state,
                city: filters.city,
                courseType: filters.courseType,
                affiliation: filters.affiliation,
                financeType: filters.financeType,
                feeRange: filters.feeRange,
                naacGrade: filters.naacGrade,
                nirfRanked: filters.nirfRanked,
                topOnly: filters.topOnly ? "Top Institutes" : "",
              }}
              filterLabels={{
                state: "State",
                city: "City",
                courseType: "Course",
                affiliation: "Affiliation",
                financeType: "Finance Type",
                feeRange: "Fee Range",
                naacGrade: "NAAC Grade",
                nirfRanked: "NIRF",
                topOnly: "Top Institutes",
              }}
              onRemoveFilter={(key) =>
                key === "topOnly"
                  ? handleFilterChange("topOnly", false)
                  : handleFilterChange(key, "")
              }
              onClearAll={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* Institute Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredInstitutes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No institutes found for the selected filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutes.map((institute) => (
              <InstituteCard key={institute._id} institute={institute} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutesPage;