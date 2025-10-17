import React, { createContext, useState, useContext, useCallback } from 'react';
import useDataStore from '../store/useDataStore';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // State to hold the accumulated search results
  const [searchResults, setSearchResults] = useState({ courses: [], institutes: [], articles: [] });
  // State to track if more results are available for the current query
  const [hasMore, setHasMore] = useState(true);
  
  const { courses, institutes, articles, fetchAllData } = useDataStore();

  // A limit for how many items to return per page/category
  const PAGE_LIMIT = 9;

  /**
   * Resets the search results to an empty state.
   * Wrapped in useCallback to ensure it has a stable identity.
   */
  const resetSearchResults = useCallback(() => {
    setSearchResults({ courses: [], institutes: [], articles: [] });
    setHasMore(true);
  }, []);

  /**
   * performSearch - client-side search with pagination support.
   * It now appends results for infinite scroll.
   */
  const performSearch = useCallback(async (query, page = 1) => {
    if (!query || query.trim() === '') {
      resetSearchResults();
      return;
    }

    // This check is mainly for the initial load if data isn't ready.
    if (!courses.length && !institutes.length && !articles.length) {
      try {
        await fetchAllData();
      } catch (err) {
        console.error("Failed to fetch initial data for search:", err);
        // Proceed with whatever data is available
      }
    }

    const q = query.toLowerCase();

    // --- Perform filtering (this finds ALL matches) ---
    const allMatchedCourses = (courses || []).filter(c => 
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.stream?.toLowerCase().includes(q)
    );

    const allMatchedInstitutes = (institutes || []).filter(i => 
      i.name?.toLowerCase().includes(q) ||
      i.location?.city?.toLowerCase().includes(q) ||
      i.location?.state?.toLowerCase().includes(q)
    );

    const allMatchedArticles = (articles || []).filter(a => 
      a.title?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );

    // --- Paginate the filtered results ---
    const paginatedCourses = allMatchedCourses.slice(0, page * PAGE_LIMIT);
    const paginatedInstitutes = allMatchedInstitutes.slice(0, page * PAGE_LIMIT);
    const paginatedArticles = allMatchedArticles.slice(0, page * PAGE_LIMIT);

    // --- Update searchResults with the new paginated data ---
    setSearchResults({
      courses: paginatedCourses,
      institutes: paginatedInstitutes,
      articles: paginatedArticles,
    });
    
    // --- Determine if there are more results to load ---
    const moreCourses = allMatchedCourses.length > paginatedCourses.length;
    const moreInstitutes = allMatchedInstitutes.length > paginatedInstitutes.length;
    const moreArticles = allMatchedArticles.length > paginatedArticles.length;

    setHasMore(moreCourses || moreInstitutes || moreArticles);

  }, [courses, institutes, articles, fetchAllData, resetSearchResults]); // Dependencies for useCallback

  return (
    <SearchContext.Provider 
      value={{ 
        searchResults, 
        performSearch,
        hasMore,
        resetSearchResults 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};