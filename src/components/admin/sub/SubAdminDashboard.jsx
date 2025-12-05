import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../../store/useDataStore";
import SubAdminNavbar from "./SubAdminNavbar";
import axios from "../../../components/api/axios";
import { useInstitutes } from "../../../hooks/useInstitutes"; // 🔹 adjust path if needed
import { toast } from "react-toastify";

import {
  BookOpenIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  CalendarIcon,
  TrophyIcon,
  StarIcon,
  ClockIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const skeletonStats = [
  {
    key: "courses",
    label: "Total Courses Managed",
    value: null,
    icon: BookOpenIcon,
    desc: "Courses managed by the sub-admin",
    color: "bg-green-100 text-green-700",
  },
  {
    key: "articles",
    label: "Total Articles Added",
    value: null,
    icon: DocumentTextIcon,
    desc: "Articles added by the sub-admin",
    color: "bg-pink-100 text-pink-700",
  },
  {
    key: "merits",
    label: "Total Merit Lists Published",
    value: null,
    icon: AcademicCapIcon,
    desc: "Merit lists published by the sub-admin",
    color: "bg-blue-100 text-blue-700",
  },
];

export default function SubAdminDashboard() {
  const { isLoggedIn } = useDataStore();
  const navigate = useNavigate();
  const { editInstitute } = useInstitutes();

  const [stats, setStats] = useState(skeletonStats);
  const [subAdminInfo, setSubAdminInfo] = useState(null);
  const [instituteInfo, setInstituteInfo] = useState(null);
  const [instituteRaw, setInstituteRaw] = useState(null); // full institute doc from API
  const [superAdminInfo, setSuperAdminInfo] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);

  // Edit mode for institute
  const [editInstituteMode, setEditInstituteMode] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [instituteForm, setInstituteForm] = useState({
    city: "",
    state: "",
    address: "",
    website: "",
    affiliation: "",
    email: "",
    phone: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Fetch data from backend
  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const authHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchAll = async () => {
      try {
        // stats, subadmin info, superadmin info
        const statsPromise = axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/subadmin/stats`,
          authHeaders
        );
        const infoPromise = axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/subadmin/info`,
          authHeaders
        );
        const adminsPromise = axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/admins`
        );

        const [statsRes, infoRes, adminsRes] = await Promise.all([
          statsPromise,
          infoPromise,
          adminsPromise,
        ]);

        // ----- Stats (global counts) -----
        const counts = statsRes.data || {};
        setStats([
          {
            key: "courses",
            label: "Total Courses Managed",
            value: counts.manageCourses ?? counts.managecourses ?? 0,
            icon: BookOpenIcon,
            desc: "Courses managed under your institute",
            color: "bg-green-100 text-green-700",
          },
          {
            key: "articles",
            label: "Total Articles Added",
            value: counts.articles ?? 0,
            icon: DocumentTextIcon,
            desc: "Articles added in the system",
            color: "bg-pink-100 text-pink-700",
          },
          {
            key: "merits",
            label: "Total Merit Lists Published",
            value: counts.merits ?? 0,
            icon: AcademicCapIcon,
            desc: "Merit lists published so far",
            color: "bg-blue-100 text-blue-700",
          },
        ]);

        // ----- SubAdmin Info -----
        const subRes = infoRes.data;
        setSubAdminInfo({
          name: subRes.name || "SubAdmin",
          email: subRes.email,
          phone: "", // no phone field in model yet
          designation: "Institute SubAdmin",
          department: "Academic Administration",
          joinDate: "N/A",
          status: "Active",
          id: subRes.id,
          instituteName: subRes.institute || "Your Institute",
        });

        // ----- Institute Info -----
        if (subRes.id) {
          try {
            const instRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/auth/subadmin/institute/${subRes.id}`,
              authHeaders
            );
            const inst = instRes.data || {};
            setInstituteRaw(inst);

            const loc = inst.location || {};
            const contact = inst.contact || {};
            const rankings = inst.rankings || {};

            const nirf = Array.isArray(rankings.nirf) ? rankings.nirf[0] : null;
            const naac = Array.isArray(rankings.naac) ? rankings.naac[0] : null;

            setInstituteInfo({
              name: inst.name || subRes.institute || "Institute",
              type: "Institute",
              establishedYear: "N/A",
              location: loc.city
                ? `${loc.city}${loc.state ? ", " + loc.state : ""}`
                : "N/A",
              address: loc.address || "N/A",
              affiliation: inst.affilication || "N/A",
              accreditation: naac?.grade || "Not specified",
              website: inst.website || "N/A",
              email: contact.instituteEmail || "N/A",
              phone: contact.instituteMobile || "N/A",
              totalStudents: inst.totalStudents || "—",
              totalFaculty: inst.totalFaculty || "—",
              departments: inst.departments || "—",
              ranking: nirf
                ? `NIRF Rank ${nirf.rank} (${nirf.year})`
                : "Not specified",
            });

            // Pre-fill edit form with editable fields
            setInstituteForm({
              city: loc.city || "",
              state: loc.state || "",
              address: loc.address || "",
              website: inst.website || "",
              affiliation: inst.affilication || "",
              email: contact.instituteEmail || "",
              phone: contact.instituteMobile || "",
            });
          } catch (e) {
            console.error("Error fetching institute details:", e);
            setInstituteInfo({
              name: subRes.institute || "Institute",
            });
          }
        }

        // ----- Super Admin Info -----
        const admins = Array.isArray(adminsRes.data) ? adminsRes.data : [];
        const superAdmin = admins[0] || null;
        if (superAdmin) {
          setSuperAdminInfo({
            name: superAdmin.name || "Super Admin",
            designation: "System Administrator",
            email: superAdmin.email,
            phone: "",
            department: "IT Administration",
            status: "Active",
          });
        }

        // ----- Recent Activities (still simple for now) -----
        setRecentActivities([
          {
            id: 1,
            action: "Logged in to dashboard",
            title: "SubAdmin session started",
            time: "Just now",
            type: "course",
          },
        ]);
      } catch (err) {
        console.error("Error loading subadmin dashboard data:", err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchAll();
  }, [isLoggedIn, editInstitute]);

  // ---- Handlers for institute edit form ----
  const handleInstituteFieldChange = (e) => {
    const { name, value } = e.target;
    setInstituteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInstituteUpdate = async (e) => {
    e.preventDefault();
    if (!instituteRaw?._id) {
      toast.error("Institute not found for update.");
      return;
    }

    setEditLoading(true);
    try {
      // Only allow updating these specific fields
      const payload = {
        location: {
          city: instituteForm.city,
          state: instituteForm.state,
          address: instituteForm.address,
        },
        website: instituteForm.website,
        affilication: instituteForm.affiliation,
        contact: {
          instituteEmail: instituteForm.email,
          instituteMobile: instituteForm.phone,
        },
      };

      const success = await editInstitute(instituteRaw._id, payload);
      if (success) {
        toast.success("Institute details updated.");

        // Update local display state too
        setInstituteInfo((prev) => {
          const locStr = instituteForm.city
            ? `${instituteForm.city}${
                instituteForm.state ? ", " + instituteForm.state : ""
              }`
            : "N/A";

          return {
            ...(prev || {}),
            location: locStr,
            address: instituteForm.address || "N/A",
            website: instituteForm.website || "N/A",
            affiliation: instituteForm.affiliation || "N/A",
            email: instituteForm.email || "N/A",
            phone: instituteForm.phone || "N/A",
          };
        });

        setEditInstituteMode(false);
      }
    } catch (err) {
      console.error("Error updating institute:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const cancelInstituteEdit = () => {
    // reset form back to current instituteInfo/instituteRaw
    if (instituteRaw) {
      const loc = instituteRaw.location || {};
      const contact = instituteRaw.contact || {};
      setInstituteForm({
        city: loc.city || "",
        state: loc.state || "",
        address: loc.address || "",
        website: instituteRaw.website || "",
        affiliation: instituteRaw.affilication || "",
        email: contact.instituteEmail || "",
        phone: contact.instituteMobile || "",
      });
    }
    setEditInstituteMode(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">Redirecting to login page...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 mt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sub-Admin Dashboard
            </h1>
            <p className="text-gray-600">
              {loadingPage
                ? "Loading your institute details..."
                : `Welcome to your administrative panel - ${
                    instituteInfo?.name || "Institute"
                  }`}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl shadow-lg p-6 flex flex-col items-center ${stat.color} transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
                onClick={() => {
                  if (stat.label.includes("Courses"))
                    navigate("/subadmin/courses");
                  else if (stat.label.includes("Articles"))
                    navigate("/subadmin/articles");
                  else if (stat.label.includes("Merit"))
                    navigate("/subadmin/meritlists");
                }}
              >
                <stat.icon className="w-10 h-10 mb-2" />
                <div className="text-3xl font-extrabold mb-1">
                  {stat.value !== null ? (
                    stat.value
                  ) : (
                    <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                  )}
                </div>
                <div className="font-semibold text-lg mb-1 text-center">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Sub-Admin Information */}
            <div className="xl:col-span-1">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                    Your Profile
                  </h2>
                  <button
                    onClick={() => navigate("/subadmin/account")}
                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <Cog6ToothIcon className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                </div>

                {subAdminInfo && (
                  <div className="space-y-4">
                    <div className="text-center pb-6 border-b border-gray-200">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {subAdminInfo.name}
                      </h3>
                      <p className="text-gray-600">
                        {subAdminInfo.designation}
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {subAdminInfo.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                        <p className="text-gray-800 font-medium">
                          {subAdminInfo.email}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <PhoneIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                        <p className="text-gray-800 font-medium">
                          {subAdminInfo.phone || "Not provided"}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Joined</p>
                        </div>
                        <p className="text-gray-800 font-medium">
                          {subAdminInfo.joinDate}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Institute Information + Edit */}
            <div className="xl:col-span-2">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    Institute Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditInstituteMode((prev) => !prev)}
                    className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {editInstituteMode ? "Close Edit" : "Edit Institute"}
                  </button>
                </div>

                {/* View Mode */}
                {!editInstituteMode && instituteInfo && (
                  <div className="space-y-6">
                    {/* Basic Institute Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Institute Name
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {instituteInfo.name}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Type</p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {instituteInfo.type}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Established
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {instituteInfo.establishedYear}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPinIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Location</p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {instituteInfo.location}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <StarIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              Accreditation
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {instituteInfo.accreditation}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrophyIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Ranking</p>
                          </div>
                          <p className="text-gray-800 font-semibold">
                            {instituteInfo.ranking}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">Email</p>
                          </div>
                          <p className="text-gray-800 font-medium">
                            {instituteInfo.email}
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <PhoneIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">Phone</p>
                          </div>
                          <p className="text-gray-800 font-medium">
                            {instituteInfo.phone}
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg md:col-span-2">
                          <div className="flex items-center gap-2 mb-1">
                            <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">Website</p>
                          </div>
                          <p className="text-gray-800 font-medium">
                            {instituteInfo.website}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Institute Statistics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {instituteInfo.totalStudents}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Students
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {instituteInfo.totalFaculty}
                          </p>
                          <p className="text-sm text-gray-600">
                            Faculty Members
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">
                            {instituteInfo.departments}
                          </p>
                          <p className="text-sm text-gray-600">
                            Departments
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {instituteInfo.accreditation || "—"}
                          </p>
                          <p className="text-sm text-gray-600">NAAC Grade</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Mode */}
                {editInstituteMode && (
                  <form
                    className="space-y-6"
                    onSubmit={handleInstituteUpdate}
                  >
                    <p className="text-sm text-gray-500 mb-2">
                      You can update contact and location details. Institute
                      name is locked and cannot be changed.
                    </p>

                    {/* Locked Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Institute Name (locked)
                        </label>
                        <input
                          type="text"
                          value={instituteInfo?.name || ""}
                          disabled
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                        />
                      </div>
                    </div>

                    {/* Location / Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={instituteForm.city}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={instituteForm.state}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="State"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={instituteForm.address}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Full address"
                        />
                      </div>
                    </div>

                    {/* Website & Affiliation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={instituteForm.website}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Affiliation
                        </label>
                        <input
                          type="text"
                          name="affiliation"
                          value={instituteForm.affiliation}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="University / Board"
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institute Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={instituteForm.email}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institute Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={instituteForm.phone}
                          onChange={handleInstituteFieldChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="+91 ..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={cancelInstituteEdit}
                        disabled={editLoading}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                      >
                        {editLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Super admin + Activities (unchanged) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Super-Admin Information */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-purple-600" />
                Super-Admin Contact
              </h2>

              {superAdminInfo && (
                <div className="space-y-6">
                  <div className="text-center pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {superAdminInfo.name}
                    </h3>
                    <p className="text-gray-600">
                      {superAdminInfo.designation}
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {superAdminInfo.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {superAdminInfo.email}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <PhoneIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500">Phone</p>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {superAdminInfo.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-green-600" />
                Recent Activities
              </h2>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "course"
                          ? "bg-blue-100"
                          : activity.type === "article"
                          ? "bg-green-100"
                          : "bg-purple-100"
                      }`}
                    >
                      {activity.type === "course" ? (
                        <BookOpenIcon className="w-5 h-5 text-blue-600" />
                      ) : activity.type === "article" ? (
                        <DocumentTextIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrophyIcon className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  View All Activities
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/subadmin/courses")}
                className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
              >
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Manage Courses
                  </h4>
                  <p className="text-sm text-gray-600">
                    Add, edit, or remove courses
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/subadmin/articles")}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
              >
                <DocumentTextIcon className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Manage Articles
                  </h4>
                  <p className="text-sm text-gray-600">
                    Create and publish articles
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/subadmin/meritlists")}
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
              >
                <TrophyIcon className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-gray-800">Merit Lists</h4>
                  <p className="text-sm text-gray-600">
                    Create and manage merit lists
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}