import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ChevronRight } from 'lucide-react';




const CourseCard = ({ course }) => {
  const getStreamColor = (stream) => {
    switch (stream) {
      case 'Science':
        return 'bg-blue-100 text-blue-800';
      case 'Commerce':
        return 'bg-green-100 text-green-800';
      case 'Arts':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStreamColor(course.stream)}`}>
            {course.stream}
          </span>
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
            {course.type}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{course.name}</h3>
        
        <div className="flex items-center mb-2">
          <Clock className="w-4 h-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-600">{course.duration}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          <span className="text-sm text-gray-600">
            Popularity: {course.popularity}/5
          </span>
        </div>
        
        <Link
          to={`/courses/${course.id}`}
          className="flex items-center text-blue-800 font-medium text-sm hover:text-blue-600"
        >
          View Details <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;