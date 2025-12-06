import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Building, FileCheck, FileText } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import InstituteCard from "../components/institutes/InstituteCard";
import ArticleCard from "../components/articles/ArticleCard";
import MeritListCard from "../components/meritList/MeritListCard";
import HeroSection from "../components/common/Hero";
import useDataStore from "../store/useDataStore";
import {
  CourseCardSkeleton,
  InstituteCardSkeleton,
  ArticleCardSkeleton,
  MeritListCardSkeleton,
} from "../components/common/SkeletonLoaders";

import { latestMeritLists } from "../data/mockData";

const HomePage = () => {
  const { courses, topInstitutes, articles, fetchAllData, loading, error } =
    useDataStore();

  // State to track scroll button visibility for each section
  const [scrollStates, setScrollStates] = useState({
    allCourses: { showLeft: false, showRight: true },
    institutes: { showLeft: false, showRight: true },
    meritLists: { showLeft: false, showRight: true },
    articles: { showLeft: false, showRight: true },
  });

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- LOGIC TO GET ALL COURSES ---
  const allCourses = useMemo(() => {
    if (!courses || courses.length === 0) {
      return [];
    }
    // Return all courses
    return courses;
  }, [courses]);

  // Function to update scroll button visibility
  const updateScrollButtons = (scrollId, stateKey) => {
    const container = document.getElementById(scrollId);
    if (!container) return;

    const showLeft = container.scrollLeft > 10;
    const showRight =
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10;

    setScrollStates((prev) => ({
      ...prev,
      [stateKey]: { showLeft, showRight },
    }));
  };

  // Add scroll event listeners for all sections
  useEffect(() => {
    const sections = [
      { id: "all-courses-scroll", key: "allCourses" },
      { id: "institutes-scroll", key: "institutes" },
      { id: "merit-lists-scroll", key: "meritLists" },
      { id: "articles-scroll", key: "articles" },
    ];

    sections.forEach(({ id, key }) => {
      const container = document.getElementById(id);
      if (container) {
        const handleScroll = () => updateScrollButtons(id, key);
        container.addEventListener("scroll", handleScroll);
        // Check initial state
        setTimeout(() => updateScrollButtons(id, key), 100);
      }
    });

    return () => {
      sections.forEach(({ id, key }) => {
        const container = document.getElementById(id);
        if (container) {
          const handleScroll = () => updateScrollButtons(id, key);
          container.removeEventListener("scroll", handleScroll);
        }
      });
    };
  }, [allCourses, topInstitutes, articles]);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-96 animate-pulse" />

        {/* Trending Courses Skeleton */}
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="w-72 flex-shrink-0">
                      <CourseCardSkeleton />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Top Institutes Skeleton */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div
                className="flex space-x-4"
                style={{ minWidth: "max-content" }}
              >
                {Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="w-72 flex-shrink-0">
                      <InstituteCardSkeleton />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Merit Lists Skeleton */}
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3)
                .fill(0)
                .map((_, idx) => (
                  <MeritListCardSkeleton key={idx} />
                ))}
            </div>
          </div>
        </section>

        {/* Latest Articles Skeleton */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, idx) => (
                  <ArticleCardSkeleton key={idx} />
                ))}
            </div>
          </div>
        </section>
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

      {/* All Courses */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
              All Courses
            </h2>
            <Link
              to="/courses"
              className="text-blue-600 text-base font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="relative group">
            <div
              id="all-courses-scroll"
              className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth"
            >
              <div
                className="flex space-x-6"
                style={{ minWidth: "max-content" }}
              >
                {allCourses.length > 0 ? (
                  allCourses.map((course) => (
                    <div key={course._id} className="w-80 flex-shrink-0">
                      <CourseCard course={course} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No courses available at the moment.
                  </p>
                )}
              </div>
            </div>
            {allCourses.length > 3 && (
              <>
                {scrollStates.allCourses.showLeft && (
                  <button
                    onClick={() => {
                      const container =
                        document.getElementById("all-courses-scroll");
                      container.scrollBy({ left: -350, behavior: "smooth" });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                {scrollStates.allCourses.showRight && (
                  <button
                    onClick={() => {
                      const container =
                        document.getElementById("all-courses-scroll");
                      container.scrollBy({ left: 350, behavior: "smooth" });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Top Institutes */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Building className="w-6 h-6 mr-2 text-blue-600" />
              Top Institutes
            </h2>
            <Link
              to="/institutes"
              className="text-blue-600 text-base font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="relative group">
            <div
              id="institutes-scroll"
              className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth"
            >
              <div
                className="flex space-x-6"
                style={{ minWidth: "max-content" }}
              >
                {topInstitutes.length > 0 ? (
                  topInstitutes.map((institute) => (
                    <div key={institute._id} className="w-80 flex-shrink-0">
                      <InstituteCard institute={institute} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No top institutes available at the moment.
                  </p>
                )}
              </div>
            </div>
            {topInstitutes.length > 3 && (
              <>
                <button
                  onClick={() => {
                    const container =
                      document.getElementById("institutes-scroll");
                    container.scrollBy({ left: -350, behavior: "smooth" });
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const container =
                      document.getElementById("institutes-scroll");
                    container.scrollBy({ left: 350, behavior: "smooth" });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10 hover:scale-110"
                >
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Recent Merit Lists */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileCheck className="w-6 h-6 mr-2 text-green-600" />
              Recent Merit Lists
            </h2>
            <Link
              to="/merit-list"
              className="text-blue-600 text-base font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="relative group">
            <div id="merit-lists-scroll" className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestMeritLists.slice(0, 6).map((meritList) => (
                  <div key={meritList.id} className="w-full">
                    <MeritListCard meritList={meritList} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-purple-600" />
              Latest Articles
            </h2>
            <Link
              to="/articles"
              className="text-blue-600 text-base font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="relative group">
            <div
              id="articles-scroll"
              className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth"
            >
              <div
                className="flex space-x-6"
                style={{ minWidth: "max-content" }}
              >
                {articles.slice(0, 6).map((article) => (
                  <div key={article.id} className="w-96 flex-shrink-0">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </div>
            {articles.length > 3 && (
              <>
                {scrollStates.articles.showLeft && (
                  <button
                    onClick={() => {
                      const container =
                        document.getElementById("articles-scroll");
                      container.scrollBy({ left: -420, behavior: "smooth" });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                {scrollStates.articles.showRight && (
                  <button
                    onClick={() => {
                      const container =
                        document.getElementById("articles-scroll");
                      container.scrollBy({ left: 420, behavior: "smooth" });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 z-10 hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Still have questions about your career?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-95">
            Our career guidance experts are here to help you make the right
            choice for your future.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            Get Career Guidance
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
