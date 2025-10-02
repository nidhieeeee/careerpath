import React from 'react';
import { Edit, Trash2, Newspaper, Calendar, User } from 'lucide-react';

const ArticleCard = ({ article, onEdit, onDelete }) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative">
        {article.thumbnail ? (
          <img
            className="w-full h-48 object-cover"
            src={article.thumbnail}
            alt={article.title}
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <Newspaper className="h-12 w-12 text-gray-300" />
          </div>
        )}
        <span className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2" title={article.title}>
          {article.title}
        </h3>
        <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
          <span className="flex items-center gap-1.5"><User size={14} /> {article.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate}</span>
        </div>
        <p className="text-sm text-gray-600 mt-3 line-clamp-3 flex-grow">
          {article.excerpt}
        </p>
        
        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onEdit} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
            <Edit size={16} /> Edit
          </button>
          <button onClick={onDelete} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;