import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../../store/useDataStore";
import SubAdminNavbar from "./SubAdminNavbar";
import axios from "../../../components/api/axios";
import { useInstitutes } from "../../../hooks/useInstitutes";
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
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function SubAdminDashboard() {
  const navigate = useNavigate();
  const { editInstitute } = useInstitutes();

  // from global store: auth + masterCourses list for courseCategory dropdown
  const {
    isLoggedIn,
    courses: masterCourses,
    fetchCourses,
  } = useDataStore();

  const [subAdminInfo, setSubAdminInfo] = useState(null);
  const [instituteInfo, setInstituteInfo] = useState(null);
  const [instituteRaw, setInstituteRaw] = useState(null); // full institute doc from API
  const [loadingPage, setLoadingPage] = useState(true);

  // Edit mode for institute (basic info)
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

  // ---- Courses state / form ----
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({
    name: "",
    duration: "",
    fees: "",
    seats: "",
    finance_type: "self",
    courseCategory: "",
  });
  const [courseEditIndex, setCourseEditIndex] = useState(null); // null = add, number = edit
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Ensure masterCourses are loaded (for searchable courseCategory)
  useEffect(() => {
    if (!masterCourses || masterCourses.length === 0) {
      fetchCourses?.();
    }
  }, [masterCourses, fetchCourses]);

  // Fetch data from backend
  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const authHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const fetchAll = async () => {
      try {
        // subadmin info
        const infoRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/subadmin/info`,
          authHeaders
        );

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

            // Init courses state
            setCourses(Array.isArray(inst.courses) ? inst.courses : []);
          } catch (e) {
            console.error("Error fetching institute details:", e);
            setInstituteInfo({
              name: subRes.institute || "Institute",
            });
          }
        }
      } catch (err) {
        console.error("Error loading subadmin dashboard data:", err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchAll();
  }, [isLoggedIn, navigate]);

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
      // Always send required + important fields so PUT doesn't drop them
      const payload = {
        // core / identifiers
        instituteId: instituteRaw.instituteId,
        instituteCode: instituteRaw.instituteCode,
        name: instituteRaw.name,
        imageUrl: instituteRaw.imageUrl,

        // rankings & flags
        rankings: instituteRaw.rankings || {
          nirf: [],
          naac: [],
          ariia: [],
          iirf: [],
        },
        isTopInstitute:
          typeof instituteRaw.isTopInstitute === "boolean"
            ? instituteRaw.isTopInstitute
            : false,

        // updated location/contact
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

        // keep current courses
        courses: courses || [],
      };

      const success = await editInstitute(instituteRaw._id, payload);
      if (success) {
        toast.success("Institute details updated.");

        // Keep local raw doc in sync
        setInstituteRaw((prev) => ({
          ...(prev || {}),
          ...payload,
        }));

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

  // ---- Courses handlers (logic aligned with InstituteForm) ----
  const handleCourseFieldChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetCourseForm = () => {
    setCourseForm({
      name: "",
      duration: "",
      fees: "",
      seats: "",
      finance_type: "self",
      courseCategory: "",
    });
    setCourseEditIndex(null);
    setCourseDropdownOpen(false);
  };

  const handleCourseEdit = (index) => {
    const c = courses[index];
    if (!c) return;
    setCourseEditIndex(index);
    setCourseForm({
      name: c.name || "",
      duration: c.duration || "",
      fees: c.fees ?? "",
      seats: c.seats ?? "",
      finance_type: c.finance_type || "self",
      courseCategory: c.courseCategory || "",
    });
    setCourseDropdownOpen(false);
  };

  const persistCourses = async (nextCourses) => {
    if (!instituteRaw?._id) {
      toast.error("Institute not found for courses update.");
      return false;
    }
    setCourseSaving(true);
    try {
      // IMPORTANT: send required / existing fields along with courses
      const payload = {
        instituteId: instituteRaw.instituteId,
        instituteCode: instituteRaw.instituteCode,
        name: instituteRaw.name,
        imageUrl: instituteRaw.imageUrl,
        // keep existing location/contact so validation passes
        location: instituteRaw.location || {
          city: "",
          state: "",
          address: "",
        },
        website: instituteRaw.website,
        affilication: instituteRaw.affilication,
        contact: instituteRaw.contact || {
          instituteEmail: "",
          instituteMobile: "",
        },
        rankings: instituteRaw.rankings || {
          nirf: [],
          naac: [],
          ariia: [],
          iirf: [],
        },
        isTopInstitute:
          typeof instituteRaw.isTopInstitute === "boolean"
            ? instituteRaw.isTopInstitute
            : false,
        // updated courses
        courses: nextCourses,
      };

      const success = await editInstitute(instituteRaw._id, payload);
      if (success) {
        setCourses(nextCourses);
        setInstituteRaw((prev) => ({
          ...(prev || {}),
          ...payload,
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating courses:", err);
      toast.error("Failed to update courses.");
      return false;
    } finally {
      setCourseSaving(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.duration) {
      toast.error("Course name and duration are required.");
      return;
    }

    const normalizedCourse = {
      name: courseForm.name.trim(),
      duration: courseForm.duration.trim(),
      fees:
        courseForm.fees === "" || courseForm.fees === null
          ? ""
          : Number(courseForm.fees),
      seats:
        courseForm.seats === "" || courseForm.seats === null
          ? ""
          : Number(courseForm.seats),
      finance_type: courseForm.finance_type || "self",
      courseCategory: courseForm.courseCategory || "",
    };

    const next = [...courses];
    if (courseEditIndex === null) {
      next.push(normalizedCourse);
    } else {
      next[courseEditIndex] = {
        ...next[courseEditIndex],
        ...normalizedCourse,
      };
    }

    const ok = await persistCourses(next);
    if (ok) {
      toast.success(
        courseEditIndex === null
          ? "Course added successfully."
          : "Course updated successfully."
      );
      resetCourseForm();
    }
  };

  const handleCourseDelete = async (index) => {
    const next = courses.filter((_, i) => i !== index);
    const ok = await persistCourses(next);
    if (ok) {
      toast.success("Course removed.");
      if (courseEditIndex === index) {
        resetCourseForm();
      }
    }
  };

  // filtered options for courseCategory dropdown (same idea as InstituteForm)
  const courseCategorySearch = (courseForm.courseCategory || "").toLowerCase();
  const filteredOptions = (masterCourses || []).filter((c) =>
    c.name?.toLowerCase().includes(courseCategorySearch)
  );
  const visibleOptions = filteredOptions.slice(0, 20);

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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
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

          {/* Profile + Institute Info */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Sub-Admin Information */}
            <div className="xl:col-span-1">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                    Your Profile
                  </h2>
                  {/* <button
                    onClick={() => navigate("/subadmin/account")}
                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                  >
                    <Cog6ToothIcon className="w-4 h-4 inline mr-1" />
                    Edit
                  </button> */}
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
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                        {subAdminInfo.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                        <p className="text-gray-800 font-medium text-sm break-all">
                          {subAdminInfo.email}
                        </p>
                      </div>

                      {subAdminInfo.phone && <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <PhoneIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                        <p className="text-gray-800 font-medium text-sm">
                          {subAdminInfo.phone || "Not provided"}
                        </p>
                      </div>}

                      {/* <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <p className="text-sm text-gray-500">Joined</p>
                        </div>
                        <p className="text-gray-800 font-medium text-sm">
                          {subAdminInfo.joinDate}
                        </p>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Institute Information + Edit */}
            <div className="xl:col-span-2">
              <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100 h-full space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    Institute Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditInstituteMode((prev) => !prev)}
                    className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-lg text-sm"
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
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Institute Name
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold text-base">
                            {instituteInfo.name}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Type
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold text-sm">
                            {instituteInfo.type}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Established
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold text-sm">
                            {instituteInfo.establishedYear}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPinIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Location
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold text-sm">
                            {instituteInfo.location}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <StarIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Accreditation
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold text-sm">
                            {instituteInfo.accreditation}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrophyIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Ranking
                            </p>
                          </div>
                          <p className="text-gray-800 font-semibold text-sm">
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
                            <p className="text-xs uppercase tracking-wide text-blue-600">
                              Email
                            </p>
                          </div>
                          <p className="text-gray-800 font-medium text-sm break-all">
                            {instituteInfo.email}
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <PhoneIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-xs uppercase tracking-wide text-blue-600">
                              Phone
                            </p>
                          </div>
                          <p className="text-gray-800 font-medium text-sm">
                            {instituteInfo.phone}
                          </p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg md:col-span-2">
                          <div className="flex items-center gap-2 mb-1">
                            <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-xs uppercase tracking-wide text-blue-600">
                              Website
                            </p>
                          </div>
                          <p className="text-gray-800 font-medium text-sm break-all">
                            {instituteInfo.website}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Mode (institute basic info) */}
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

          {/* BIG Courses Management Section */}
          {instituteRaw && (
            <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpenIcon className="w-7 h-7 text-blue-600" />
                    Courses Offered
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Add, update, and remove courses for{" "}
                    <span className="font-semibold">
                      {instituteInfo?.name || "this institute"}
                    </span>
                    .
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                  <span className="font-semibold text-blue-700">
                    Tip:&nbsp;
                  </span>
                  <span>
                    Use the{" "}
                    <span className="font-semibold">Course Category</span> field
                    to search courses from the master list.
                  </span>
                </div>
              </div>

              {/* Layout: Left form (sticky) + Right table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Add / Edit course form */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5 sticky top-24">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {courseEditIndex === null
                        ? "Add New Course"
                        : "Edit Course"}
                    </h3>
                    <form className="space-y-3" onSubmit={handleCourseSubmit}>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Course Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="e.g., B.Sc Computer Science"
                          name="name"
                          value={courseForm.name}
                          onChange={handleCourseFieldChange}
                          required
                          className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Searchable Course Category field */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Course Category (search & select)
                        </label>
                        <input
                          placeholder="Type to search categories..."
                          name="courseCategory"
                          value={courseForm.courseCategory}
                          onChange={(e) => {
                            handleCourseFieldChange(e);
                            setCourseDropdownOpen(true);
                          }}
                          onFocus={() => setCourseDropdownOpen(true)}
                          onBlur={() =>
                            setTimeout(() => setCourseDropdownOpen(false), 150)
                          }
                          className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {courseDropdownOpen && (
                          <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border rounded-md shadow-lg text-xs">
                            {visibleOptions.length === 0 ? (
                              <div className="px-3 py-2 text-gray-500">
                                No matching courses
                              </div>
                            ) : (
                              visibleOptions.map((opt) => (
                                <button
                                  key={opt._id}
                                  type="button"
                                  className="w-full text-left px-3 py-2 hover:bg-indigo-50"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setCourseForm((prev) => ({
                                      ...prev,
                                      courseCategory: opt.name,
                                    }));
                                    setCourseDropdownOpen(false);
                                  }}
                                >
                                  {opt.name}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Duration <span className="text-red-500">*</span>
                        </label>
                        <input
                          placeholder="e.g., 3 years"
                          name="duration"
                          value={courseForm.duration}
                          onChange={handleCourseFieldChange}
                          required
                          className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Fees (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 75000"
                            name="fees"
                            value={courseForm.fees}
                            onChange={handleCourseFieldChange}
                            className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Seats
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 60"
                            name="seats"
                            value={courseForm.seats}
                            onChange={handleCourseFieldChange}
                            className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Finance Type
                        </label>
                        <select
                          name="finance_type"
                          value={courseForm.finance_type}
                          onChange={handleCourseFieldChange}
                          className="w-full p-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="self">Self Finance</option>
                          <option value="government">Government</option>
                          <option value="aided">Aided</option>
                        </select>
                      </div>

                      <div className="flex justify-between gap-2 pt-2">
                        {courseEditIndex !== null && (
                          <button
                            type="button"
                            onClick={resetCourseForm}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs hover:bg-gray-50"
                            disabled={courseSaving}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={courseSaving}
                          className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                        >
                          {courseSaving
                            ? "Saving..."
                            : courseEditIndex === null
                            ? "Add Course"
                            : "Update Course"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Courses list - bigger, scrollable, better UX */}
                <div className="lg:col-span-2">
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white h-full flex flex-col">
                    <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Courses List
                      </h3>
                      <span className="text-xs text-gray-500">
                        {courses?.length || 0} course
                        {courses?.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="overflow-auto max-h-[480px]">
                      {courses && courses.length > 0 ? (
                        <table className="min-w-full text-xs md:text-sm">
                          <thead className="sticky top-0 z-10 bg-gray-50">
                            <tr className="text-left text-[11px] md:text-xs font-semibold text-gray-600">
                              <th className="px-3 py-2 md:px-4 md:py-3">
                                Name
                              </th>
                              <th className="px-3 py-2 md:px-4 md:py-3 hidden sm:table-cell">
                                Category
                              </th>
                              <th className="px-3 py-2 md:px-4 md:py-3">
                                Duration
                              </th>
                              <th className="px-3 py-2 md:px-4 md:py-3">
                                Fees
                              </th>
                              <th className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
                                Seats
                              </th>
                              <th className="px-3 py-2 md:px-4 md:py-3 hidden lg:table-cell">
                                Finance
                              </th>
                              <th className="px-3 py-2 md:px-4 md:py-3 text-right">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {courses.map((c, idx) => (
                              <tr
                                key={idx}
                                className="border-t hover:bg-gray-50"
                              >
                                <td className="px-3 py-2 md:px-4 md:py-3 text-gray-900 font-medium align-top">
                                  <div className="flex flex-col">
                                    <span>{c.name}</span>
                                    <span className="sm:hidden text-[11px] text-gray-500 mt-0.5">
                                      {c.courseCategory || "No category"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700 text-xs align-top hidden sm:table-cell">
                                  {c.courseCategory || "—"}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700 text-xs align-top">
                                  {c.duration}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700 text-xs align-top">
                                  {c.fees !== "" && c.fees != null
                                    ? `₹${c.fees}`
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700 text-xs align-top hidden md:table-cell">
                                  {c.seats !== "" && c.seats != null
                                    ? c.seats
                                    : "—"}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-gray-700 text-[11px] align-top hidden lg:table-cell">
                                  {c.finance_type
                                    ? c.finance_type
                                        .toString()
                                        .replace("_", " ")
                                        .replace(/\b\w/g, (ch) =>
                                          ch.toUpperCase()
                                        )
                                    : "Self"}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 text-right align-top">
                                  <div className="flex justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleCourseEdit(idx)}
                                      className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] md:text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCourseDelete(idx)}
                                      className="px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[11px] md:text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex items-center justify-center h-40 text-sm text-gray-500">
                          No courses added yet. Use the form on the left to add
                          your first course.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* <button
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
              </button> */}

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