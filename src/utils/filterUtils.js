/**
 * Comprehensive Filter Utility Functions
 * Provides consistent filtering logic across the entire application
 */

/**
 * Filter items by search term across multiple fields
 * @param {Array} items - Items to filter
 * @param {String} searchTerm - Search query
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} - Filtered items
 */
export const filterBySearch = (items, searchTerm, searchFields = []) => {
  if (!searchTerm || searchTerm.trim() === "") return items;

  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = field.split(".").reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(term);
    })
  );
};

/**
 * Filter items by a single property value
 * @param {Array} items - Items to filter
 * @param {String} property - Property to filter by
 * @param {String|Array} value - Value(s) to match
 * @param {Boolean} exact - If true, exact match; if false, case-insensitive match
 * @returns {Array} - Filtered items
 */
export const filterByProperty = (items, property, value, exact = false) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return items;

  const values = Array.isArray(value) ? value : [value];

  return items.filter((item) => {
    const itemValue = item[property];
    if (exact) {
      return values.includes(itemValue);
    }
    return values.some(
      (v) => itemValue?.toString().toLowerCase() === v?.toString().toLowerCase()
    );
  });
};

/**
 * Apply multiple filters to items
 * @param {Array} items - Items to filter
 * @param {Object} filters - Object with filter criteria
 * @param {String} filters.search - Search term
 * @param {Array} filters.searchFields - Fields to search in
 * @param {Object} filters.properties - Property filters
 * @param {Function} filters.customFilter - Custom filter function
 * @returns {Array} Filtered items
 */
export const applyFilters = (
  items,
  { search = "", searchFields = [], properties = {}, customFilter = null }
) => {
  let filtered = items;

  // Apply search filter
  if (search && searchFields.length > 0) {
    filtered = filterBySearch(filtered, search, searchFields);
  }

  // Apply property filters
  Object.entries(properties).forEach(([prop, value]) => {
    if (value) {
      filtered = filterByProperty(filtered, prop, value);
    }
  });

  // Apply custom filter function
  if (customFilter && typeof customFilter === "function") {
    filtered = filtered.filter(customFilter);
  }

  return filtered;
};

/**
 * Get unique values for a property
 * @param {Array} items - Items to extract values from
 * @param {String} property - Property to extract
 * @returns {Array} - Unique values
 */
export const getUniqueValues = (items, property) => {
  return [
    ...new Set(
      items.map((item) => item[property]).filter((val) => val && val !== "")
    ),
  ].sort();
};

/**
 * Get unique values for multiple properties
 * @param {Array} items - Items to extract values from
 * @param {Array} properties - Properties to extract
 * @returns {Object} - Object with unique values for each property
 */
export const getUniqueValuesForProperties = (items, properties = []) => {
  const result = {};
  properties.forEach((prop) => {
    result[prop] = getUniqueValues(items, prop);
  });
  return result;
};

/**
 * Clear all filter values
 * @param {Object} filterState - Current filter state object
 * @returns {Object} - Reset filter state with empty values
 */
export const clearAllFilters = (filterState) => {
  const cleared = {};
  Object.keys(filterState).forEach((key) => {
    cleared[key] = "";
  });
  return cleared;
};

/**
 * Check if any filters are active
 * @param {Object} filters - Filter values object
 * @returns {Boolean} - True if any filter is active
 */
export const hasActiveFilters = (filters) => {
  return Object.values(filters).some(
    (val) =>
      val !== "" && val !== null && (Array.isArray(val) ? val.length > 0 : true)
  );
};

/**
 * Debounced search function
 * @param {Function} callback - Function to call after debounce
 * @param {Number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounceSearch = (callback, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

/**
 * Filter items by date range
 * @param {Array} items - Items to filter
 * @param {String} dateField - Field containing date
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered items
 */
export const filterByDateRange = (items, dateField, startDate, endDate) => {
  return items.filter((item) => {
    const date = new Date(item[dateField]);
    return date >= startDate && date <= endDate;
  });
};

/**
 * Filter items by multiple criteria (complex filtering)
 * @param {Array} items - Items to filter
 * @param {Array} criteria - Array of criteria objects
 * @returns {Array} - Filtered items
 */
export const filterByMultipleCriteria = (items, criteria = []) => {
  return items.filter((item) =>
    criteria.every((crit) => {
      const value = item[crit.field];
      switch (crit.operator) {
        case "equals":
          return value === crit.value;
        case "contains":
          return value
            ?.toString()
            .toLowerCase()
            .includes(crit.value?.toLowerCase());
        case "startsWith":
          return value?.toString().startsWith(crit.value);
        case "endsWith":
          return value?.toString().endsWith(crit.value);
        case "greaterThan":
          return value > crit.value;
        case "lessThan":
          return value < crit.value;
        case "in":
          return Array.isArray(crit.value) && crit.value.includes(value);
        default:
          return true;
      }
    })
  );
};
