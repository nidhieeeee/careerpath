import { useState, useEffect, useCallback } from "react";
import { applyFilters, hasActiveFilters } from "../utils/filterUtils";

/**
 * Custom hook for managing filtered data
 * @param {Array} data - Original data to filter
 * @param {Object} initialFilters - Initial filter state
 * @returns {Object} - Filtered data and filter utilities
 */
export const useFilteredData = (data = [], initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [filteredData, setFilteredData] = useState(data);
  const [isFiltering, setIsFiltering] = useState(false);

  // Apply filters whenever data or filters change
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      try {
        const filtered = applyFilters(data, filters);
        setFilteredData(filtered);
      } finally {
        setIsFiltering(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [data, filters]);

  // Update a single filter
  const updateFilter = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Clear all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Remove a specific filter
  const removeFilter = useCallback((filterName) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[filterName];
      return updated;
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilter = hasActiveFilters(filters);

  // Get count of active filters
  const activeFilterCount = Object.values(filters).filter((val) => {
    if (val === "" || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;

  return {
    filteredData,
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    removeFilter,
    hasActiveFilter,
    activeFilterCount,
    isFiltering,
  };
};

/**
 * Custom hook for search functionality
 * @param {Array} data - Data to search
 * @param {Array} searchFields - Fields to search in
 * @param {Number} debounceDelay - Debounce delay in ms
 * @returns {Object} - Search functionality
 */
export const useSearch = (
  data = [],
  searchFields = [],
  debounceDelay = 300
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(data);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      if (!searchTerm) {
        setSearchResults(data);
      } else {
        const results = applyFilters(data, {
          search: searchTerm,
          searchFields,
        });
        setSearchResults(results);
      }
      setIsSearching(false);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, data, searchFields, debounceDelay]);

  const updateSearchTerm = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    searchResults,
    updateSearchTerm,
    clearSearch,
    isSearching,
    hasSearchResults: searchResults.length > 0,
  };
};
