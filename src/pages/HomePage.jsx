import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  GraduationCap, 
  BookOpen, 
  Building, 
  FileText, 
  TrendingUp, 
  School, 
  FileCheck 
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import CourseCard from '../components/courses/CourseCard';
import InstituteCard from '../components/institutes/InstituteCard';
import ArticleCard from '../components/articles/ArticleCard';
import MeritListCard from '../components/meritList/MeritListCard';
import HeroSection from '../components/common/Hero';
import useDataStore from '../store/useDataStore';
import { useEffect } from 'react';

// Mock data - in a real app, this would come from an API
import { trendingCourses, topInstitutes, latestMeritLists, latestArticles } from '../data/mockData';

const HomePage = () => {
    const {
    courses,
    institutes,
    articles,
    fetchAllData,
    loading,
    error
  } = useDataStore();

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading)
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 text-lg font-semibold">Loading, please wait...</p>
      </div>
    </div>
  );

  if (error)
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md text-center">
        <strong className="font-semibold">Oops! Something went wrong.</strong>
        <p className="mt-2">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Confused about your career path?
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Explore courses, colleges, and career options to make informed decisions about your future.
          </p>
          <div className="w-[95vw] flex justify-center">
            <div className="max-w-md">
              <SearchBar />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link
              to="/after-12th"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <GraduationCap className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">After 12th</span>
            </Link>
            <Link
              to="/after-graduation"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">After Graduation</span>
            </Link>
            <Link
              to="/courses"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <School className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">All Courses</span>
            </Link>
            <Link
              to="/institutes"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg p-4 transition-all transform hover:scale-105"
            >
              <Building className="w-8 h-8 mx-auto mb-2" />
              <span className="block text-sm font-medium">Institutes</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section> */}

      <HeroSection/>

      {/* Sticky Search on Mobile */}
      <div className="md:hidden sticky top-0 z-30 bg-white shadow-md p-3">
        <SearchBar />
      </div>

      {/* Trending Courses */}
      {/* <section className="py-10 px-4">
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
              {courses?.map((course) => (
                <div key={course._id} className="w-72 flex-shrink-0">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

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
              {institutes.map((institute) => (
                <div key={institute._id} className="w-72 flex-shrink-0">
                  <InstituteCard institute={institute} />
                </div>
              ))}
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
            {latestArticles.slice(0, 3).map((article) => (
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