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

// Mock data - in a real app, this would come from an API
import { trendingCourses, topInstitutes, latestMeritLists, latestArticles } from '../data/mockData';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection/>
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
              {trendingCourses.map((course) => (
                <div key={course.id} className="w-72 flex-shrink-0">
                  <CourseCard course={course} />
                </div>
              ))}
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
              {topInstitutes.map((institute) => (
                <div key={institute.id} className="w-72 flex-shrink-0">
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