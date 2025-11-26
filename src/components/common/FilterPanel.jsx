import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";

/**
 * Generic Filter Component for displaying filter UI
 * @param {Array} filters - Array of filter configuration objects
 * @param {Object} currentFilters - Current filter values
 * @param {Function} onFilterChange - Callback when filter changes
 * @param {Function} onClearAll - Callback to clear all filters
 * @returns {JSX.Element}
 */
export const FilterPanel = ({
  filters = [],
  currentFilters = {},
  onFilterChange,
  onClearAll,
  showHeader = true,
  className = "",
}) => {
  const hasActiveFilters = Object.values(currentFilters).some(
    (val) =>
      val !== "" && val !== null && (Array.isArray(val) ? val.length > 0 : true)
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
            >
              <RotateCcw size={14} />
              Clear All
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filters.map((filter) => (
          <FilterField
            key={filter.id}
            filter={filter}
            value={currentFilters[filter.id] || ""}
            onChange={(value) => onFilterChange(filter.id, value)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Individual Filter Field Component
 */
const FilterField = ({ filter, value, onChange }) => {
  switch (filter.type) {
    case "select":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filter.label}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{filter.placeholder || "Select..."}</option>
            {filter.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filter.label}
          </label>
          <div className="space-y-2">
            {filter.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(value)
                      ? value.includes(opt.value)
                      : value === opt.value
                  }
                  onChange={(e) => {
                    if (Array.isArray(value)) {
                      if (e.target.checked) {
                        onChange([...value, opt.value]);
                      } else {
                        onChange(value.filter((v) => v !== opt.value));
                      }
                    } else {
                      onChange(e.target.checked ? opt.value : "");
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "radio":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filter.label}
          </label>
          <div className="space-y-2">
            {filter.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={filter.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="rounded-full border-gray-300"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "range":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filter.label}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={filter.min}
              max={filter.max}
              value={value?.min || ""}
              onChange={(e) => {
                const newValue = {
                  ...value,
                  min: e.target.value ? Number(e.target.value) : "",
                };
                onChange(newValue);
              }}
              placeholder={`Min (${filter.min})`}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              min={filter.min}
              max={filter.max}
              value={value?.max || ""}
              onChange={(e) => {
                const newValue = {
                  ...value,
                  max: e.target.value ? Number(e.target.value) : "",
                };
                onChange(newValue);
              }}
              placeholder={`Max (${filter.max})`}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

/**
 * Active Filters Display Component
 * Shows active filters as badges with remove buttons
 */
export const ActiveFilters = ({
  filters = {},
  filterLabels = {},
  onRemoveFilter,
  onClearAll,
  className = "",
}) => {
  const activeFilters = Object.entries(filters).filter(([, value]) => {
    if (value === "" || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
        >
          <span>
            {filterLabels[key] || key}:{" "}
            {Array.isArray(value) ? value.join(", ") : value}
          </span>
          <button
            onClick={() => onRemoveFilter(key)}
            className="hover:bg-blue-200 rounded-full p-0.5 transition"
            title="Remove filter"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

/**
 * Search Filter Component
 */
export const SearchFilter = ({
  value = "",
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute left-3 top-2.5 text-gray-400">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.076.09.11l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.858-3.859a1 1 0 0 0-.11-.09zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </span>
      {value && (
        <button
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
