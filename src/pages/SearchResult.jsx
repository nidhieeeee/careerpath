import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext'; // Assuming this context exists
import CourseCard from '../components/courses/CourseCard';
import InstituteCard from '../components/institutes/InstituteCard';
import ArticleCard from '../components/articles/ArticleCard';

const SearchResult = () => {
  const [params] = useSearchParams();
  const query = params.get('q');
  
  // Note: For this to be fully optimized, `performSearch` should be wrapped in `useCallback` in your SearchContext.
  const { searchResults, performSearch } = useSearch();
  
  // Initialize loading to true if a query exists on page load for immediate feedback.
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState(null);

  // Main effect to run the search when the query changes.
  useEffect(() => {
    // If there's no query, do nothing.
    if (!query) {
      setLoading(false);
      return;
    }

    // Use AbortController to cancel the request if the component unmounts or the query changes.
    const controller = new AbortController();

    const runSearch = async () => {
      setLoading(true);
      setError(null); // Reset error on new search
      try {
        // You may need to update `performSearch` to accept an abort signal.
        await performSearch(query, { signal: controller.signal });
      } catch (err) {
        // Don't update state if the error is from aborting the request.
        if (err.name !== 'AbortError') {
          setError('Failed to fetch search results. Please try again.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    runSearch();

    // Cleanup function: This runs when the component unmounts or `query` changes.
    return () => {
      controller.abort(); // Cancel the ongoing search request.
    };
  }, [query, performSearch]);

  const renderResults = () => {
    // If there's an error, display it.
    if (error) {
      return <div className="text-center text-red-600 mt-8">{error}</div>;
    }
    
    // If loading for the first time, show a clear message.
    if (loading) {
      return <div className="text-center text-gray-600 mt-8">Searching...</div>;
    }

    // If there are no results after loading.
    const noResultsFound = !searchResults || Object.values(searchResults).every(arr => !arr || arr.length === 0);
    if (noResultsFound) {
      return (
        <div className="text-center text-gray-600 mt-8">
          No results found for "{query}"
        </div>
      );
    }

    // Render the search results.
    return (
      <div className="space-y-12">
        {/* Courses Section */}
        {searchResults.courses?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.courses.map(course => (
                <CourseCard key={`course-${course._id}`} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Institutes Section */}
        {searchResults.institutes?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Institutes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.institutes.map(institute => (
                <InstituteCard key={`institute-${institute._id}`} institute={institute} />
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        {searchResults.articles?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.articles.map(article => (
                <ArticleCard key={`article-${article._id}`} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 min-h-screen">
      {query && (
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Search Results for: <span className="text-blue-600">"{query}"</span>
        </h2>
      )}
      {renderResults()}
    </div>
  );
};

export default SearchResult;