import React, { use, useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import useDataStore from '../store/useDataStore';
import { useEffect } from 'react';

const After12thPage = () => {
  const [activeStream, setActiveStream] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { courses, fetchCourses, loading } = useDataStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  
  // For a real app, these would be API-fetched
  // Filter courses to only include UG or Diploma
  const relevantCourses = courses.filter(
    course => course.type === 'UG' || course.type === 'Diploma'
  );
  
  const filteredCourses = activeStream === 'all' 
    ? relevantCourses 
    : relevantCourses.filter(course => course.stream.toLowerCase() === activeStream);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">After 12th: What's Next?</h1>
          <p className="text-blue-100">
            Explore courses and career paths based on your stream
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['all', 'science', 'commerce', 'arts'].map((stream) => (
              <button
                key={stream}
                onClick={() => setActiveStream(stream)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeStream === stream
                    ? 'bg-blue-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stream === 'all' ? 'All Streams' : stream.charAt(0).toUpperCase() + stream.slice(1)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Type
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">Any Type</option>
                  <option value="ug">Undergraduate</option>
                  <option value="diploma">Diploma</option>
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
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              What are the best career options after 12th Science?
            </h3>
            <p className="text-gray-600">
              After 12th Science, popular options include Engineering (B.Tech/B.E), Medical (MBBS/BDS), 
              B.Sc, Architecture, Pharmacy, and various other specialized courses. Your choice should 
              align with your interests, aptitude, and career goals.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Should I choose a diploma or a degree course?
            </h3>
            <p className="text-gray-600">
              Diplomas are shorter, more practical, and get you into the workforce quicker. Degrees are longer 
              but provide deeper theoretical knowledge and better long-term career prospects. Your choice depends 
              on your immediate goals and career plans.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              How important are entrance exams after 12th?
            </h3>
            <p className="text-gray-600">
              For many professional courses like Engineering (JEE) and Medical (NEET), entrance exams are mandatory 
              and extremely important. Your rank in these competitive exams determines the quality of institution 
              you can get admitted to, which significantly impacts your career prospects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default After12thPage;