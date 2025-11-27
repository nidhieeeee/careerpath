import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Building, 
  FileCheck,
  FileText
} from 'lucide-react';
import CourseCard from '../components/courses/CourseCard';
import InstituteCard from '../components/institutes/InstituteCard';
import ArticleCard from '../components/articles/ArticleCard';
import MeritListCard from '../components/meritList/MeritListCard';
import HeroSection from '../components/common/Hero';
import useDataStore from '../store/useDataStore';

// Mock data for fallback or initial render - in a real app, this would be empty
import { latestMeritLists, latestArticles } from '../data/mockData';

const HomePage = () => {
  const {
    courses,
    topInstitutes,
    articles,
    meritLists,
    fetchAllData,
    loading,
    error
  } = useDataStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- NEW LOGIC TO SORT COURSES BY POPULARITY ---
  const trendingCourses = useMemo(() => {
    // Define the order of popularity
    const popularityOrder = {
      high: 3,
      moderate: 2,
      low: 1,
    };

    if (!courses || courses.length === 0) {
      return [];
    }

    // Create a copy of the courses array to avoid mutating the original state
    const sortedCourses = [...courses].sort((a, b) => {
      // Get the numerical value for each course's popularity, defaulting to 0 if not present
      const popularityA = popularityOrder[a.popularity?.toLowerCase()] || 0;
      const popularityB = popularityOrder[b.popularity?.toLowerCase()] || 0;
      // Sort in descending order (High > Moderate > Low)
      return popularityB - popularityA;
    });

    // Return only the top 10 trending courses
    return sortedCourses.slice(0, 10);
  }, [courses]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md text-center">
          <strong className="font-semibold">Oops! Something went wrong.</strong>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Courses */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
              Trending Courses
            </h2>
            <Link
              to="/courses"
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
              {trendingCourses.length > 0 ? (
                trendingCourses.map((course) => (
                  <div key={course._id} className="w-72 flex-shrink-0">
                    <CourseCard course={course} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No trending courses available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Top Institutes */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Top Institutes
            </h2>
            <Link
              to="/institutes"
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
              {topInstitutes.length > 0 ? (
                topInstitutes.map((institute) => (
                  <div key={institute._id} className="w-72 flex-shrink-0">
                    <InstituteCard institute={institute} />
                  </div>
                ))
              ) : (
                 <p className="text-gray-500">No top institutes available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Merit Lists */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FileCheck className="w-5 h-5 mr-2 text-green-600" />
              Recent Merit Lists
            </h2>
            <Link
              to="/merit-list"
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestMeritLists.slice(0, 3).map((meritList) => (
              <MeritListCard key={meritList.id} meritList={meritList} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Latest Articles
            </h2>
            <Link
              to="/articles"
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-800 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions about your career?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Our career guidance experts are here to help you make the right choice for your future.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-800 font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Get Career Guidance
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;