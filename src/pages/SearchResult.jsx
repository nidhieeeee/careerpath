import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import CourseCard from '../components/courses/CourseCard';
import InstituteCard from '../components/institutes/InstituteCard';
import ArticleCard from '../components/articles/ArticleCard';

const SearchResult = () => {
  const [params] = useSearchParams();
  const query = params.get('q');

  const { searchResults, performSearch, resetSearchResults } = useSearch();

  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      resetSearchResults();
      setLoading(false);
      return;
    }

    const runSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        // page = 1 for first load
        await performSearch(query, 1);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query, performSearch, resetSearchResults]);

  const renderResults = () => {
    if (error) {
      return <div className="text-center text-red-600 mt-8">{error}</div>;
    }

    if (loading) {
      return <div className="text-center text-gray-600 mt-8">Searching...</div>;
    }

    const noResultsFound =
      !searchResults ||
      Object.values(searchResults).every(
        (arr) => !arr || arr.length === 0
      );

    if (noResultsFound) {
      return (
        <div className="text-center text-gray-600 mt-8">
          No results found for "{query}"
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {searchResults.courses?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
              Courses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.courses.map((course) => (
                <CourseCard key={`course-${course._id}`} course={course} />
              ))}
            </div>
          </section>
        )}

        {searchResults.institutes?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
              Institutes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.institutes.map((institute) => (
                <InstituteCard
                  key={`institute-${institute._id}`}
                  institute={institute}
                />
              ))}
            </div>
          </section>
        )}

        {searchResults.articles?.length > 0 && (
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
              Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.articles.map((article) => (
                <ArticleCard
                  key={`article-${article._id}`}
                  article={article}
                />
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
          Search Results for:{' '}
          <span className="text-blue-600">"{query}"</span>
        </h2>
      )}
      {renderResults()}
    </div>
  );
};

export default SearchResult;