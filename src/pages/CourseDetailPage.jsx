import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, Building2, IndianRupee, Users, ArrowLeft } from 'lucide-react';
import useDataStore from '../store/useDataStore';

// --- Helper Functions ---

/**
 * Checks if an institute has any ranking data.
 * (Currently unused for priority, but kept if you want later.)
 */
const hasRankingData = (institute) => {
  if (!institute?.rankings) return false;
  const { nirf, naac, ariia, iirf } = institute.rankings || {};
  return [nirf, naac, ariia, iirf].some(arr => Array.isArray(arr) && arr.length > 0);
};

/**
 * Extract numeric fee values in a robust way.
 * Supports: number, "100000-200000", { min, max }, { minFee, maxFee }, { feeMin, feeMax }.
 */
const extractFeeNumbers = (fee) => {
  const values = [];
  if (!fee) return values;

  if (typeof fee === 'number') {
    if (fee > 0) values.push(fee);
  } else if (typeof fee === 'string') {
    // e.g. "100000 - 200000 per year"
    const cleaned = fee.replace(/[^\d\-–]/g, ''); // keep digits and -/–
    const parts = cleaned
      .split(/-|–/)
      .map(p => parseInt(p, 10))
      .filter(n => !isNaN(n) && n > 0);
    values.push(...parts);
  } else if (typeof fee === 'object') {
    const { min, max, minFee, maxFee, feeMin, feeMax } = fee;
    [min, max, minFee, maxFee, feeMin, feeMax].forEach(v => {
      if (typeof v === 'number' && v > 0) values.push(v);
    });
  }

  return values;
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, institutes, fetchCourses, fetchInstitutes, loading } = useDataStore();

  useEffect(() => {
    if (courses.length === 0) fetchCourses();
    if (institutes.length === 0) fetchInstitutes();
  }, [fetchCourses, fetchInstitutes, courses.length, institutes.length]);

  const course = courses.find((c) => c._id === id || c.courseId === id);

  // Helper: courseCategory keys to match against (supports id or name)
  const courseCategoryKeys = useMemo(() => {
    if (!course) return [];
    return [course.courseId, course._id, course.name]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());
  }, [course]);

  // --- Recommended Institutes (by courseCategory) ---
  const recommendedInstitutes = useMemo(() => {
    if (!course || institutes.length === 0 || courseCategoryKeys.length === 0) return [];

    const matches = institutes.filter(inst => {
      const instCourses = inst.courses || [];
      return instCourses.some(c => {
        if (!c.courseCategory) return false;
        const cat = String(c.courseCategory).toLowerCase();
        return courseCategoryKeys.includes(cat);
      });
    });

    // Sort: isTopInstitute first, then by name
    return matches
      .map(inst => ({
        ...inst,
        isPrioritized: !!inst.isTopInstitute,
      }))
      .sort((a, b) => {
        if (a.isPrioritized && !b.isPrioritized) return -1;
        if (!a.isPrioritized && b.isPrioritized) return 1;
        return (a.name || '').localeCompare(b.name || '');
      });
  }, [course, institutes, courseCategoryKeys]);

  // --- Approx Fee Range & Total Seats (based on courseCategory) ---
  const { feeRangeDisplay, totalSeatsDisplay } = useMemo(() => {
    if (!course || institutes.length === 0 || courseCategoryKeys.length === 0) {
      return { feeRangeDisplay: 'N/A', totalSeatsDisplay: 'N/A' };
    }

    const fees = [];
    const seats = [];

    const collectFeeSeat = (instCourse) => {
      if (!instCourse) return;

      // FEES
      const feeVals = extractFeeNumbers(instCourse.fees);
      if (feeVals.length > 0) {
        fees.push(...feeVals);
      }

      // SEATS
      if (typeof instCourse.seats === 'number' && instCourse.seats > 0) {
        seats.push(instCourse.seats);
      }
    };

    // Step 1 – use all institutes where courseCategory matches
    institutes.forEach(inst => {
      (inst.courses || []).forEach(instCourse => {
        if (!instCourse.courseCategory) return;
        const cat = String(instCourse.courseCategory).toLowerCase();
        if (courseCategoryKeys.includes(cat)) {
          collectFeeSeat(instCourse);
        }
      });
    });

    // Step 2 – fallback to base course if nothing found
    if (fees.length === 0 && course.fees) {
      const feeVals = extractFeeNumbers(course.fees);
      if (feeVals.length > 0) fees.push(...feeVals);
    }
    if (seats.length === 0 && typeof course.seats === 'number' && course.seats > 0) {
      seats.push(course.seats);
    }

    const formatFeeRange = (arr) => {
      if (!arr.length) return 'N/A';
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      if (!isFinite(min) || !isFinite(max)) return 'N/A';
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    };

    const formatTotalSeats = (arr) => {
      if (!arr.length) return 'N/A';
      const total = arr.reduce((sum, current) => sum + current, 0);
      return total.toLocaleString();
    };

    return {
      feeRangeDisplay: formatFeeRange(fees),
      totalSeatsDisplay: formatTotalSeats(seats),
    };
  }, [course, institutes, courseCategoryKeys]);

  // --- UI ---

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
          <Link
            to="/courses"
            className="inline-flex items-center text-blue-100 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.name}</h1>
          <div className="flex items-center space-x-2">
            {course.type && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
                {course.type}
              </span>
            )}
            {course.stream && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
                {course.stream}
              </span>
            )}
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
              <p className="text-gray-600 mb-6">
                {course.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{course.duration || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Popularity</p>
                    <p className="font-medium">{course.popularity || 'N/A'}</p>
                  </div>
                </div>
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
                    <p className="text-sm text-gray-500">Total Available Seats (Approx.)</p>
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
                  recommendedInstitutes.slice(0, 10).map((institute) => (
                    <div key={institute.instituteCode || institute._id} className="flex items-start">
                      <Building2 className="w-5 h-5 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {institute.name}
                          {institute.isTopInstitute && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                              Top Institute
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {institute.location?.city}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No institutes found offering this course yet.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-600 mb-4">
                Get personalized guidance from our career experts.
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