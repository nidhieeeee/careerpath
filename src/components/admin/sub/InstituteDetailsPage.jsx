import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubAdminNavbar from "./SubAdminNavbar";
import * as instituteService from "../../../services/instituteService";
import {
  ShieldCheckIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  XCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { DetailPageSkeleton } from "../../common/SkeletonLoaders";

export default function InstituteDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [institute, setInstitute] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch institute details with stats
        const instituteData = await instituteService.fetchInstituteById(id);
        if (instituteData && instituteData.institute) {
          setInstitute(instituteData.institute);
          console.log("✅ Institute details loaded:", instituteData.institute);
        }

        // Fetch courses for this institute
        try {
          const coursesData = await instituteService.fetchInstituteCourses(id);
          setCourses(coursesData);
          console.log(`✅ Loaded ${coursesData.length} courses`);
        } catch (coursesErr) {
          console.warn("Failed to fetch courses:", coursesErr.message);
        }
      } catch (err) {
        console.error("Failed to fetch institute details:", err);
        setError(err.message || "Failed to load institute details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstituteDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <SubAdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <DetailPageSkeleton />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SubAdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
              <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-red-900 font-bold text-lg mb-1">
                  Error Loading Institute
                </h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => navigate("/subadmin/dashboard")}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!institute) {
    return (
      <>
        <SubAdminNavbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <p className="text-gray-600 text-lg">Institute not found</p>
              <button
                onClick={() => navigate("/subadmin/dashboard")}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SubAdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate("/subadmin/dashboard")}
            className="mb-6 flex items-center gap-2 text-blue-900 hover:text-blue-950 font-semibold bg-white px-4 py-2 rounded-lg shadow transition"
          >
            <ShieldCheckIcon className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Institute Header Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="w-9 h-9 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    {institute.name}
                  </h1>
                  {institute.isTop && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full">
                      <CheckBadgeIcon className="w-4 h-4" />
                      Top Institute
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Institute Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              {institute.location && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Location
                    </p>
                    <p className="text-gray-900 font-medium">
                      {typeof institute.location === "object"
                        ? `${institute.location?.city || ""}, ${
                            institute.location?.state || ""
                          }`
                        : institute.location}
                    </p>
                    {typeof institute.location === "object" &&
                      institute.location?.address && (
                        <p className="text-gray-600 text-sm mt-1">
                          {institute.location.address}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {/* Institute Code */}
              {institute.code && (
                <div className="flex items-start gap-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Institute Code
                    </p>
                    <p className="text-gray-900 font-mono font-semibold">
                      {institute.code}
                    </p>
                  </div>
                </div>
              )}

              {/* Type */}
              {institute.type && (
                <div className="flex items-start gap-3">
                  <AcademicCapIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Type
                    </p>
                    <p className="text-gray-900 font-medium">
                      {institute.type}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact */}
              {institute.contact && (
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Contact
                    </p>
                    <p className="text-gray-900 font-medium">
                      {institute.contact}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              {institute.email && (
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Email
                    </p>
                    <p className="text-gray-900 font-medium">
                      {institute.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Website */}
              {institute.website && (
                <div className="flex items-start gap-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Website
                    </p>
                    <a
                      href={institute.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      {institute.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {institute.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                  About
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {institute.description}
                </p>
              </div>
            )}
          </div>

          {/* Courses Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
              <AcademicCapIcon className="w-7 h-7 text-blue-700" />
              Courses Offered ({courses.length})
            </h3>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition"
                  >
                    <h4 className="font-bold text-gray-900 mb-1">
                      {course.title || course.name}
                    </h4>
                    {course.duration && (
                      <p className="text-sm text-gray-600">
                        Duration: {course.duration}
                      </p>
                    )}
                    {course.eligibility && (
                      <p className="text-sm text-gray-600">
                        Eligibility: {course.eligibility}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  No courses available for this institute.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
