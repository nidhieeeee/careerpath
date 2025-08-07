import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, Building2, IndianRupee, Users, ArrowLeft } from 'lucide-react';
import useDataStore from '../store/useDataStore';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, fetchCourses, loading } = useDataStore();

  useEffect(() => {
    fetchCourses(); // fetch if not already done
  }, [fetchCourses]);

  const course = courses.find((c) => c._id === id || c.courseId === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4">
        <div className="container mx-auto">
          <Link
            to="/courses"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.name}</h1>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
              {course.type}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
              {course.stream}
            </span>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Course Overview</h2>
              <p className="text-gray-600 mb-6">{course.description || 'No description provided.'}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Popularity</p>
                    <p className="font-medium">{course.popularity || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Fees</p>
                    <p className="font-medium">₹{course.fees?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Seats</p>
                    <p className="font-medium">{course.seats == '0' ? '60' : course.seats}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Career Opportunities</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  Professional roles in relevant industries
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  Research and development opportunities
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  Higher education prospects
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  Entrepreneurship possibilities
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Top Institutes</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start">
                    <Building2 className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Institute {i}</p>
                      <p className="text-sm text-gray-500">Location {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-600 mb-4">
                Get personalized guidance from our career experts
              </p>
              <Link
                to="/contact"
                className="block w-full bg-blue-800 text-white text-center py-2 rounded-md hover:bg-blue-900 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
