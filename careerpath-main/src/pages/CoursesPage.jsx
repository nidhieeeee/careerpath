import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import { trendingCourses } from '../data/mockData';

const CoursesPage = () => {
  const [activeType, setActiveType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const courseTypes = ['all', 'UG', 'PG', 'Diploma'];
  
  const filteredCourses = activeType === 'all'
    ? trendingCourses
    : trendingCourses.filter(course => course.type === activeType);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore All Courses</h1>
          <p className="text-blue-100">
            Discover a wide range of courses across different streams and levels
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {courseTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeType === type
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All Courses' : type}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 md:mt-0 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-100 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stream
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">All Streams</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">Any Duration</option>
                  <option value="1-2">1-2 Years</option>
                  <option value="3-4">3-4 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fee Type
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">Any Type</option>
                  <option value="self">Self-Finance</option>
                  <option value="govt">Government</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-900">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No courses found for the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;