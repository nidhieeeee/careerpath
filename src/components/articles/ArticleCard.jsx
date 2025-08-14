import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';


const ArticleCard = ({ article, featured = false }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Exams':
        return 'bg-purple-100 text-purple-800';
      case 'Tips':
        return 'bg-green-100 text-green-800';
      case 'Courses':
        return 'bg-blue-100 text-blue-800';
      case 'Trends':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`aspect-w-16 aspect-h-9 ${featured ? 'md:aspect-w-2 md:aspect-h-1' : ''}`}>
        <img
          src={article.thumbnail}
          alt={article.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              {new Date(article.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        
        <Link to={`/articles/${article.id}`}>
          <h3 className={`font-semibold ${featured ? 'text-xl' : 'text-lg'} mb-2 text-gray-800 hover:text-blue-700`}>
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-xs">
            <User className="w-3 h-3 mr-1" />
            <span>{article.author}</span>
          </div>
          
          <Link
            to={`/articles/${article._id}`}
            className="text-blue-700 font-medium text-sm hover:text-blue-900"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;