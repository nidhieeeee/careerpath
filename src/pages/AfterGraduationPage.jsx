import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import { trendingCourses } from '../data/mockData';

const AfterGraduationPage = () => {
  const [activeStream, setActiveStream] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // In a real app, these would come from an API
  // Filter to only include PG courses
  const postGradCourses = trendingCourses.filter(course => course.type === 'PG');
  
  // For demo purposes, let's modify some courses to be PG
  const mockPGCourses = [
    {
      id: '6',
      name: 'Master of Technology (M.Tech)',
      duration: '2 years',
      description: 'An advanced engineering program for specialized technical expertise.',
      popularity: 4.6,
      type: 'PG',
      stream: 'Science',
      fees: 150000,
      seats: 60,
      finance_type: 'Self-Finance',
    },
    {
      id: '7',
      name: 'Master of Business Administration (MBA)',
      duration: '2 years',
      description: 'Advanced business program for management and leadership roles.',
      popularity: 4.7,
      type: 'PG',
      stream: 'Commerce',
      fees: 200000,
      seats: 120,
      finance_type: 'Self-Finance',
    },
    {
      id: '8',
      name: 'Master of Arts (MA) in Economics',
      duration: '2 years',
      description: 'Advanced study of economic theories, policies, and applications.',
      popularity: 4.2,
      type: 'PG',
      stream: 'Arts',
      fees: 80000,
      seats: 60,
      finance_type: 'Government',
    },
  ];
  
  const allPGCourses = [...postGradCourses, ...mockPGCourses];
  
  const filteredCourses = activeStream === 'all' 
    ? allPGCourses 
    : allPGCourses.filter(course => course.stream.toLowerCase() === activeStream);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">After Graduation: What's Next?</h1>
          <p className="text-blue-100">
            Explore post-graduate courses and career advancement opportunities
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
                  Course Specialization
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  <option value="">Any Specialization</option>
                  <option value="tech">Technology</option>
                  <option value="mgmt">Management</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts & Humanities</option>
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

      {/* Career Paths Section */}
      <div className="container mx-auto px-4 py-8 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Career Paths After Graduation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">Higher Education</h3>
            <p className="text-gray-600 mb-4">
              Pursue advanced degrees like Masters or PhD to specialize in your field and 
              gain deeper knowledge. Ideal for academic and research-oriented careers.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">M.Tech</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">MBA</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">MSc</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">PhD</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">Professional Certifications</h3>
            <p className="text-gray-600 mb-4">
              Short-term, industry-focused certifications that enhance your skills and 
              employability. Perfect for quick career advancement in specific domains.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Project Management</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Digital Marketing</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Data Science</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">Job Market</h3>
            <p className="text-gray-600 mb-4">
              Enter the workforce directly with your undergraduate degree. Gain practical 
              experience and build your career through on-the-job learning.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Entry-level Positions</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Management Trainee</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Associate Roles</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">Entrepreneurship</h3>
            <p className="text-gray-600 mb-4">
              Start your own business venture using the knowledge and skills acquired during 
              your undergraduate studies. Be your own boss and create employment opportunities.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Startups</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Freelancing</span>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Consulting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterGraduationPage;