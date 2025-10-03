import React, { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import SubAdminNavbar from "../components/admin/SubAdminNavbar";

const skeletonStats = [
  {
    label: "Total Courses Managed",
    value: null,
    icon: BookOpenIcon,
    desc: "Courses managed by the sub-admin",
    color: "bg-green-100 text-green-700",
    loading: true,
  },
  {
    label: "Total Articles Added",
    value: null,
    icon: DocumentTextIcon,
    desc: "Articles added by the sub-admin",
    color: "bg-pink-100 text-pink-700",
    loading: true,
  },
  {
    label: "Total Merit Lists Published",
    value: null,
    icon: AcademicCapIcon,
    desc: "Merit lists published by the sub-admin",
    color: "bg-blue-100 text-blue-700",
    loading: true,
  },
];

export default function SubAdminDashboard() {
  const [stats, setStats] = useState(skeletonStats);
  const [subAdminInfo, setSubAdminInfo] = useState(null);
  const [instituteInfo, setInstituteInfo] = useState(null);
  const [superAdminInfo, setSuperAdminInfo] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/subadmin/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats([
          {
            label: "Total Courses Managed",
            value: data.coursesManaged,
            icon: BookOpenIcon,
            desc: "Courses managed by the sub-admin",
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Total Articles Added",
            value: data.articlesAdded,
            icon: DocumentTextIcon,
            desc: "Articles added by the sub-admin",
            color: "bg-pink-100 text-pink-700",
          },
          {
            label: "Total Merit Lists Published",
            value: data.meritListsPublished,
            icon: AcademicCapIcon,
            desc: "Merit lists published by the sub-admin",
            color: "bg-blue-100 text-blue-700",
          },
        ]);
      })
      .catch(() => {
        toast.error("Failed to fetch stats");
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch sub-admin information
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/subadmin/info`, { headers })
      .then((res) => res.json())
      .then((data) => setSubAdminInfo(data))
      .catch(() => toast.error("Failed to fetch sub-admin information"));

    // Fetch institute information
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/subadmin/institute`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setInstituteInfo(data))
      .catch(() => toast.error("Failed to fetch institute information"));

    // Fetch super-admin information
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/superadmin/info`, { headers })
      .then((res) => res.json())
      .then((data) => setSuperAdminInfo(data))
      .catch(() => toast.error("Failed to fetch super-admin information"));
  }, []);

  useEffect(() => {
    // Demo data for sub-admin information
    setSubAdminInfo({
      name: "John Doe",
      email: "john.doe@example.com",
    });

    // Demo data for institute information
    setInstituteInfo({
      name: "Tech Institute",
      location: "New York, USA",
    });

    // Demo data for super-admin information
    setSuperAdminInfo({
      name: "Jane Smith",
      email: "jane.smith@example.com",
    });
  }, []);

  return (
    <>
      <SubAdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 py-10 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sub-Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to your administrative panel
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl shadow-lg p-6 flex flex-col items-center ${stat.color}`}
              >
                <stat.icon className="w-10 h-10 mb-2" />
                <div className="text-3xl font-extrabold mb-1">
                  {stat.value !== null ? stat.value : "00"}
                </div>
                <div className="font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Sub-Admin Information */}
          {subAdminInfo && (
            <div className="mb-8 bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Sub-Admin Information
                </h2>
                <div className="flex space-x-3">
                  <button
                    className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-lg border border-blue-300"
                    onClick={() =>
                      toast.info("Redirecting to forget password page...")
                    }
                  >
                    Reset Password
                  </button>
                  <button
                    className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 hover:scale-110 hover:shadow-xl transition-all duration-300 shadow-lg border border-blue-300"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("role");
                      toast.success("Logged out successfully!");
                      window.location.href = "/admin";
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-800 font-semibold">
                    {subAdminInfo.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 font-semibold">
                    {subAdminInfo.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Institute Information */}
          {instituteInfo && (
            <div className="mb-8 bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Institute Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Institute Name</p>
                  <p className="text-gray-800 font-semibold">
                    {instituteInfo.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-800 font-semibold">
                    {instituteInfo.location}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Super-Admin Information */}
          {superAdminInfo && (
            <div className="mb-8 bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Super-Admin Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-800 font-semibold">
                    {superAdminInfo.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 font-semibold">
                    {superAdminInfo.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-6 text-center shadow-lg">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">
            &copy; 2025 CareerPath. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
