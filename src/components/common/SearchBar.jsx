import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { performSearch } = useSearch();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (query.trim() === '') return;

    // Run the search using data from the global store (may fetch data if needed)
    try {
      await performSearch(query);
    } catch (err) {
      // ignore search errors; navigation still proceeds
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery('');
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  return (
    <div className="relative">
      <div className={`flex items-center transition-all duration-300 bg-white rounded-full border ${
  isExpanded
    ? 'w-full md:w-80 border-blue-300 shadow-md'
    : 'w-10 h-10 md:w-48 border-gray-200'
}`}>

        {isExpanded ? (
          <form onSubmit={handleSearch} className="w-full flex items-center">
            <Search className="ml-3 text-gray-400 h-5 w-5 flex-shrink-0" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, colleges..."
              className="w-full py-2 px-3 text-sm bg-transparent border-none focus:outline-none"
            />
            <button
              type="button"
              onClick={toggleExpand}
              className="mr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <button
            onClick={toggleExpand}
            className="flex items-center justify-center md:justify-start w-full h-10 px-3 text-sm text-gray-500 focus:outline-none"
          >
            <Search className="h-5 w-5 flex-shrink-0" />
            <span className="hidden md:block ml-2">Search...</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;