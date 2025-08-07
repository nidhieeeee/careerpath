import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const SearchResult = () => {
  const [params] = useSearchParams();
  const query = params.get('q');
  const { searchResults } = useSearch();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Results for: {query}</h2>
      <pre>{JSON.stringify(searchResults, null, 2)}</pre>
    </div>
  );
};

export default SearchResult;
