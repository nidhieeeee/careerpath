import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, Building2, IndianRupee, Users, ArrowLeft } from 'lucide-react';
import useDataStore from '../store/useDataStore';

// --- Helper Functions for Matching ---

/**
 * Extracts significant keywords from a course name string.
 * This helps in matching similar courses like "B.Tech in Computer Science" and "Computer Science & Engineering".
 * @param {string} name - The full name of the course.
 * @returns {string[]} An array of lowercase keywords.
 */
const getCourseKeywords = (name = '') => {
  // Common words to ignore to improve match quality
  const stopWords = new Set(['of', 'in', 'and', 'a', 'the', 'for', 'with', 'an', 'program', 'engineering', 'technology']);
  // Normalize string: lowercase, replace punctuation with spaces for easier splitting
  const normalizedName = name.toLowerCase().replace(/[(),-]/g, ' ');
  // Split into words, filter out stop words and short/empty strings
  return normalizedName.split(/\s+/).filter(word => word && word.length > 2 && !stopWords.has(word));
};

/**
 * Checks if an institute has any ranking data available in its record.
 * @param {object} institute - The institute object from your data.
 * @returns {boolean} True if any ranking data (NIRF, NAAC, etc.) exists.
 */
const hasRankingData = (institute) => {
  if (!institute?.rankings) return false;
  const { nirf, naac, ariia, iirf } = institute.rankings;
  // Return true if any of the ranking arrays have at least one entry
  return [nirf, naac, ariia, iirf].some(arr => Array.isArray(arr) && arr.length > 0);
};


const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, institutes, fetchCourses, fetchInstitutes, loading } = useDataStore();

  useEffect(() => {
    // Fetch data only if it's not already in the store
    if (courses.length === 0) fetchCourses();
    if (institutes.length === 0) fetchInstitutes();
  }, [fetchCourses, fetchInstitutes, courses.length, institutes.length]);

  const course = courses.find((c) => c._id === id || c.courseId === id);

  // Memoized calculation for recommended institutes to prevent re-running on every render
  const recommendedInstitutes = useMemo(() => {
    const mainKeywords = getCourseKeywords(course?.name);
    if (!course || mainKeywords.length === 0 || institutes.length === 0) {
      return [];
    }
    
    // Use a Map to handle duplicates efficiently, using instituteCode as a unique key
    const allMatches = new Map();

    // --- Primary Search: Find top-rated or ranked institutes first ---
    const topMatches = institutes.filter(inst => {
      const isConsideredTop = inst.isTopInstitute || hasRankingData(inst);
      const offersSimilarCourse = inst.courses.some(instCourse => {
        const instKeywords = getCourseKeywords(instCourse.name);
        const sharedKeywords = mainKeywords.filter(k => instKeywords.includes(k));
        const requiredMatches = mainKeywords.length > 2 ? 2 : 1; // Require more matches for longer names
        return sharedKeywords.length >= requiredMatches;
      });
      return isConsideredTop && offersSimilarCourse;
    });

    // Add top matches to the map, marking them as prioritized for sorting later
    topMatches.forEach(inst => allMatches.set(inst.instituteCode, { ...inst, isPrioritized: true }));

    // --- Fallback Search: If we have fewer than 5 results, find more from the general pool ---
    if (allMatches.size < 5) {
      const additionalMatches = institutes.filter(inst => {
        // Ensure we don't re-process institutes that are already in our map
        if (allMatches.has(inst.instituteCode)) return false;

        return inst.courses.some(instCourse => {
          const instKeywords = getCourseKeywords(instCourse.name);
          const sharedKeywords = mainKeywords.filter(k => instKeywords.includes(k));
          const requiredMatches = mainKeywords.length > 2 ? 2 : 1;
          return sharedKeywords.length >= requiredMatches;
        });
      });
      
      additionalMatches.forEach(inst => allMatches.set(inst.instituteCode, { ...inst, isPrioritized: false }));
    }

    // Convert the map back to an array and sort it
    return Array.from(allMatches.values()).sort((a, b) => {
      // Prioritized items (top/ranked) should always come first in the list
      if (a.isPrioritized && !b.isPrioritized) return -1;
      if (!a.isPrioritized && b.isPrioritized) return 1;
      return 0; // Maintain original order otherwise
    });
  }, [course, institutes]);

  // --- Logic to calculate and format Fee Range and Total Seats ---
  const { feeRangeDisplay, totalSeatsDisplay } = useMemo(() => {
    if (!course) return { feeRangeDisplay: 'N/A', totalSeatsDisplay: 'N/A' };

    const mainKeywords = getCourseKeywords(course.name);
    const fees = [];
    const seats = [];

    if (recommendedInstitutes.length > 0) {
      recommendedInstitutes.forEach(inst => {
        inst.courses.forEach(instCourse => {
          const instKeywords = getCourseKeywords(instCourse.name);
          const sharedKeywords = mainKeywords.filter(k => instKeywords.includes(k));
          const requiredMatches = mainKeywords.length > 2 ? 2 : 1;
          
          if (sharedKeywords.length >= requiredMatches) {
            if (instCourse.fees && instCourse.fees > 0) fees.push(instCourse.fees);
            // Ensure seat number is valid before adding
            if (typeof instCourse.seats === 'number' && instCourse.seats >= 0) seats.push(instCourse.seats);
          }
        });
      });
    }

    // Fallback to the base course's data if no other data is found from recommended list
    if (fees.length === 0 && course.fees > 0) fees.push(course.fees);
    if (seats.length === 0 && course.seats > 0) seats.push(course.seats);

    // Helper to format the fee array into a display string (e.g., "₹100,000 - ₹500,000" or just "₹300,000")
    const formatFeeRange = (arr) => {
      if (arr.length === 0) return 'N/A';
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      if (min === max) return `₹${min.toLocaleString()}`;
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    };

    // Helper to calculate and format the total seats
    const formatTotalSeats = (arr) => {
        if (arr.length === 0) return 'N/A';
        const total = arr.reduce((sum, current) => sum + current, 0);
        return total.toLocaleString();
    }

    return {
      feeRangeDisplay: formatFeeRange(fees),
      totalSeatsDisplay: formatTotalSeats(seats)
    };
  }, [course, recommendedInstitutes]);


  if (loading && !course) {
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
          <Link to="/courses" className="inline-flex items-center text-blue-100 hover:text-white mb-4">
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

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Popularity</p>
                    <p className="font-medium">{course.popularity || 'N/A'}</p>
                  </div>
                </div>
                {/* UPDATED FEE AND SEAT DISPLAY */}
                <div className="flex items-center">
                  <IndianRupee className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Approx. Fee Range</p>
                    <p className="font-medium">{feeRangeDisplay}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Available Seats</p>
                    <p className="font-medium">{totalSeatsDisplay}</p>
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
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Institutes</h3>
              <div className="space-y-4">
                {recommendedInstitutes.length > 0 ? (
                  recommendedInstitutes.slice(0, 10).map((institute) => ( // Show up to 10 institutes
                    <div key={institute.instituteCode} className="flex items-start">
                      <Building2 className="w-5 h-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{institute.name}</p>
                        <p className="text-sm text-gray-500">{institute.location?.city}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No institutes found offering a similar course.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-600 mb-4">
                Get personalized guidance from our career experts.
              </p>
              <Link to="/contact" className="block w-full bg-blue-800 text-white text-center py-2 rounded-md hover:bg-blue-900 transition-colors">
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