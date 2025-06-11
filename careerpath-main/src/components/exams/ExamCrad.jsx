// components/ExamCard.jsx
import React from 'react';
import { CalendarDays, FileText, GraduationCap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExamCard = ({ exam }) => {
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'government':
        return 'bg-red-100 text-red-800';
      case 'entrance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
            {exam.type}
          </span>
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full capitalize">
            {exam.category}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-gray-800">{exam.name}</h3>

        <div className="flex items-center mb-2 text-gray-600 text-sm">
          <CalendarDays className="w-4 h-4 mr-1 text-gray-500" />
          {exam.date}
        </div>

        <div className="flex items-center mb-4 text-gray-600 text-sm">
          <GraduationCap className="w-4 h-4 mr-1 text-gray-500" />
          {exam.level}
        </div>

        <Link
          to={exam.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-800 font-medium text-sm hover:text-blue-600"
        >
          Apply Now <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ExamCard;
