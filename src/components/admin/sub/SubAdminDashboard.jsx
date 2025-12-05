import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../../store/useDataStore";
import { useAuth } from "../../../context/AuthContext";
import SubAdminNavbar from "./SubAdminNavbar";
import * as subAdminService from "../../../services/subAdminService";
import * as instituteService from "../../../services/instituteService";
import {
  Skeleton,
  StatsCardSkeleton,
} from "../../../components/common/SkeletonLoaders";
import {
  BookOpenIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Skeleton Loader Component
const SkeletonLoader = ({ count = 1 }) => (
  <div className="space-y-3">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"
        ></div>
      ))}
  </div>
);

const skeletonStats = [
  {
    label: "Total Courses Managed",
    value: null,
    icon: BookOpenIcon,
    desc: "Courses managed",
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Total Articles Added",
    value: null,
    icon: DocumentTextIcon,
    desc: "Articles published",
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Total Merit Lists Published",
    value: null,
    icon: AcademicCapIcon,
    desc: "Merit lists created",
    color: "bg-yellow-100 text-yellow-700",
  },
];

export default function SubAdminDashboard() {
  const { isLoggedIn } = useDataStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(skeletonStats);
  const [subAdminInfo, setSubAdminInfo] = useState(null);
  const [instituteInfo, setInstituteInfo] = useState(null);
  const [instituteCourses, setInstituteCourses] = useState([]);
  const [error, setError] = useState(null);

  // Check authentication
  useEffect(() => {
    if (!isLoggedIn && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoggedIn, isAuthenticated, navigate]);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);

        // Check if token exists
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("authToken") ||
          sessionStorage.getItem("token");

        if (!token) {
          console.warn(
            "⚠️ No authentication token found. Please log in first."
          );
          setError("Authentication token not found. Please log in again.");
          navigate("/login");
          return;
        }

        const subAdminId =
          localStorage.getItem("subadminId") || "6930a8479db1fa3b3ba61753";

        // Fetch dashboard data
        const dashboardData = await subAdminService.fetchSubAdminDashboard(
          subAdminId
        );

        if (dashboardData) {
          // Update stats
          if (dashboardData.stats) {
            setStats([
              {
                label: "Total Courses Managed",
                value: dashboardData.stats.totalCourses || 0,
                icon: BookOpenIcon,
                desc: "Courses managed",
                color: "bg-blue-100 text-blue-700",
              },
              {
                label: "Total Articles Added",
                value: dashboardData.stats.totalArticles || 0,
                icon: DocumentTextIcon,
                desc: "Articles published",
                color: "bg-green-100 text-green-700",
              },
              {
                label: "Total Merit Lists Published",
                value: dashboardData.stats.totalMeritLists || 0,
                icon: AcademicCapIcon,
                desc: "Merit lists created",
                color: "bg-yellow-100 text-yellow-700",
              },
            ]);
          }

          // Update subadmin info
          if (dashboardData.subAdmin) {
            setSubAdminInfo(dashboardData.subAdmin);
          }

          // Update institute info from dashboard data (fallback)
          if (dashboardData.institute) {
            setInstituteInfo(dashboardData.institute);
          }
        }

        // Fetch institute information using the new service
        try {
          const instituteData = await instituteService.fetchMyInstitute();
          if (instituteData && instituteData.institute) {
            setInstituteInfo(instituteData.institute);
            console.log("✅ Institute data fetched:", instituteData.institute);

            // Fetch courses for this institute
            if (instituteData.institute._id) {
              try {
                const coursesData =
                  await instituteService.fetchInstituteCourses(
                    instituteData.institute._id
                  );
                setInstituteCourses(coursesData);
                console.log(
                  `✅ Found ${coursesData.length} courses for institute`
                );
              } catch (coursesErr) {
                console.warn(
                  "Failed to fetch institute courses:",
                  coursesErr.message
                );
              }
            }
          }
        } catch (instituteErr) {
          console.warn(
            "Failed to fetch institute from new endpoint:",
            instituteErr.message
          );
          // If this fails, we'll use the institute data from dashboard (if available)
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
      }
    };

    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2l7 6v6c0 5-3.5 9-7 9s-7-4-7-9V8l7-6z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">
            You are not authorized to view this page. If you have subadmin
            credentials, please log in by clicking the button below.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubAdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back,{" "}
              <span className="font-bold">
                {subAdminInfo?.name || "SubAdmin"}
              </span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="max-w-7xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;

              if (stat.value === null) {
                return <StatsCardSkeleton key={stat.label} />;
              }

              return (
                <div
                  key={stat.label}
                  onClick={() => {
                    if (stat.label.includes("Courses"))
                      navigate("/subadmin/courses");
                    else if (stat.label.includes("Articles"))
                      navigate("/subadmin/articles");
                    else if (stat.label.includes("Merit"))
                      navigate("/subadmin/meritlists");
                  }}
                  className={`rounded-2xl shadow-lg p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover:shadow-xl ${stat.color}`}
                >
                  <Icon className="w-10 h-10 mb-2" />
                  <div className="text-3xl font-extrabold mb-1">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-lg mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Main Information Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
            {/* Sub-Admin Profile */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-blue-700" />
                  Profile
                </h2>
                <button
                  onClick={() => navigate("/subadmin/account")}
                  className="py-2 px-4 bg-blue-700 hover:bg-blue-900 text-white font-semibold rounded-xl shadow transition duration-200 text-sm flex items-center gap-2"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {subAdminInfo ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {subAdminInfo.name}
                      </h3>
                      <p className="text-gray-700 text-sm font-medium">
                        {subAdminInfo.designation || "SubAdmin"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <SkeletonLoader count={3} />
              )}
            </div>

            {/* Institute Information */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-700" />
                Institute
              </h2>

              {instituteInfo ? (
                <div className="space-y-4">
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                      Name
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {instituteInfo.name}
                    </p>
                  </div>

                  {instituteInfo.code && (
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                        Institute Code
                      </p>
                      <p className="text-gray-700 font-mono font-semibold text-base">
                        {instituteInfo.code}
                      </p>
                    </div>
                  )}

                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                      Location
                    </p>
                    <p className="text-gray-700 font-medium text-base">
                      {typeof instituteInfo.location === "object"
                        ? `${instituteInfo.location?.city || ""}, ${
                            instituteInfo.location?.state || ""
                          }`
                        : instituteInfo.location}
                    </p>
                  </div>

                  {instituteCourses.length > 0 && (
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                        Total Courses
                      </p>
                      <p className="text-gray-900 font-semibold text-lg">
                        {instituteCourses.length} Courses
                      </p>
                    </div>
                  )}

                  {instituteInfo.isTop && (
                    <div className="pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          ⭐ TOP INSTITUTE
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() =>
                        navigate(`/subadmin/institute/${instituteInfo._id}`)
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm mt-2 transition-colors"
                    >
                      View Full Details
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <SkeletonLoader count={3} />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300 max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/subadmin/courses")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 border border-blue-200 hover:border-blue-300 group"
              >
                <div className="p-2 bg-blue-200 group-hover:bg-blue-300 rounded-lg transition-colors">
                  <BookOpenIcon className="w-5 h-5 text-blue-700" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Courses
                  </h4>
                  <p className="text-xs text-gray-600">Manage</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/subadmin/articles")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 border border-green-200 hover:border-green-300 group"
              >
                <div className="p-2 bg-green-200 group-hover:bg-green-300 rounded-lg transition-colors">
                  <DocumentTextIcon className="w-5 h-5 text-green-700" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Articles
                  </h4>
                  <p className="text-xs text-gray-600">Publish</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/subadmin/meritlists")}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-200 border border-yellow-200 hover:border-yellow-300 group"
              >
                <div className="p-2 bg-yellow-200 group-hover:bg-yellow-300 rounded-lg transition-colors">
                  <AcademicCapIcon className="w-5 h-5 text-yellow-700" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Merit Lists
                  </h4>
                  <p className="text-xs text-gray-600">Create</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
