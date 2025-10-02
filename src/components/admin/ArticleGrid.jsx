import React from 'react';
import ArticleCard from './ArticleCard';
import { Loader2 } from 'lucide-react';

// A skeleton component for a better loading experience
const ArticleCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
    <div className="p-5">
      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="flex items-center space-x-4 mt-3">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  </div>
);


const ArticleGrid = ({ articles, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => <ArticleCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700">No Articles Found</h3>
        <p className="text-gray-500 mt-2">Click "Add Article" to create your first one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          onEdit={() => onEdit(article)}
          onDelete={() => onDelete(article._id)}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;