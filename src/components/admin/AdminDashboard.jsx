import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import useDataStore from "../../store/useDataStore";
import AdminNavbar from "../../components/admin/AdminNavbar";

import {
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  NewspaperIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Skeletons for loading
const skeletonStats = [
  {
    label: "Total Institutes",
    value: null,
    icon: AcademicCapIcon,
    desc: "Registered institutes",
    color: "bg-blue-100 text-blue-700",
    loading: true,
  },
  {
    label: "Total Courses",
    value: null,
    icon: BookOpenIcon,
    desc: "Available courses",
    color: "bg-green-100 text-green-700",
    loading: true,
  },
  {
    label: "Total Merits",
    value: null,
    icon: DocumentTextIcon,
    desc: "Published merit lists",
    color: "bg-yellow-100 text-yellow-700",
    loading: true,
  },
  {
    label: "Total Articles",
    value: null,
    icon: NewspaperIcon,
    desc: "Published articles",
    color: "bg-pink-100 text-pink-700",
    loading: true,
  },
];

const iconMap = {
  "Total Institutes": AcademicCapIcon,
  "Total Courses": BookOpenIcon,
  "Total Merits": DocumentTextIcon,
  "Total Articles": NewspaperIcon,
};

const colorMap = {
  "Total Institutes": "bg-blue-100 text-blue-700",
  "Total Courses": "bg-green-100 text-green-700",
  "Total Merits": "bg-yellow-100 text-yellow-700",
  "Total Articles": "bg-pink-100 text-pink-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(skeletonStats);
  const { isLoggedIn } = useDataStore();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [subAdmins, setSubAdmins] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const formRef = useRef(null);

  const [institutes, setInstitutes] = useState([]);
  const [form, setForm] = useState({
    institute: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    permissions: {
      manageCourses: false,
      manageInstituteDetails: false,
      addArticles: false,
      addMeritLists: false,
    },
  });

  // Fetch institutes for dropdown
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/institutes`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInstitutes(data);
      })
      .catch(() => toast.error("Failed to fetch institutes"));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/subadmins`)
      .then((res) => res.json())
      .then((data) => setSubAdmins(data))
      .catch(() => toast.error("Failed to fetch sub-admins"));
  }, []);

  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (
      name === "manageCourses" ||
      name === "manageInstituteDetails" ||
      name === "addArticles" ||
      name === "addMeritLists"
    ) {
      setForm({
        ...form,
        permissions: {
          ...form.permissions,
          [name]: checked,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            institute: form.institute,
            permissions: form.permissions,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Sub-admin created successfully");
        setForm({
          institute: "",
          name: "",
          email: "",
          phone: "",
          password: "",
          permissions: {
            manageCourses: false,
            manageInstituteDetails: false,
            addArticles: false,
            addMeritLists: false,
          },
        });
        setEditIndex(null);
      } else {
        toast.error(data.error || "Failed to create sub-admin");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleFormReset = () => {
    setForm({
      institute: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      permissions: {
        manageCourses: false,
        manageInstituteDetails: false,
        addArticles: false,
        addMeritLists: false,
      },
    });
    setEditIndex(null);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/auth/stats/counts`)
      .then((res) => res.json())
      .then((data) => {
        // Map backend response to frontend stats format
        setStats([
          {
            label: "Total Institutes",
            value: data.institutes,
            icon: AcademicCapIcon,
            desc: "Registered institutes",
            color: "bg-blue-100 text-blue-700",
          },
          {
            label: "Total Courses",
            value: data.manageCourses,
            icon: BookOpenIcon,
            desc: "Available courses",
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Total Merits",
            value: data.merits,
            icon: DocumentTextIcon,
            desc: "Published merit lists",
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            label: "Total Articles",
            value: data.articles,
            icon: NewspaperIcon,
            desc: "Published articles",
            color: "bg-pink-100 text-pink-700",
          },
        ]);
      })
      .catch(() => {
        toast.error("Failed to fetch stats");
      });
  }, []);

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const parsedData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Parsed Excel Data:", parsedData); // Debugging

      // Format rows
      const formatted = parsedData.map((row) => {
        const subAdmin = {
          name: row["subAdminName"] || "",
          email: row["subAdminEmail"] || "",
          institute: row["instituteName"] || "",
        };

        // Handle permissions
        const permissions = {};
        if ("manageCourses" in row) {
          permissions.manageCourses =
            row["manageCourses"] === true ||
            row["manageCourses"]?.toString().toLowerCase() === "true";
        }
        if ("manageInstituteDetails" in row) {
          permissions.manageInstituteDetails =
            row["manageInstituteDetails"] === true ||
            row["manageInstituteDetails"]?.toString().toLowerCase() === "true";
        }
        if ("addArticles" in row) {
          permissions.addArticles =
            row["addArticles"] === true ||
            row["addArticles"]?.toString().toLowerCase() === "true";
        }
        if ("addMeritLists" in row) {
          permissions.addMeritLists =
            row["addMeritLists"] === true ||
            row["addMeritLists"]?.toString().toLowerCase() === "true";
        }

        if (Object.keys(permissions).length > 0) {
          subAdmin.permissions = permissions;
        }
        console.log(subAdmin);
        return subAdmin;
      });
      // You may want to setSubAdmins or handle the formatted data here
      setSubAdmins(formatted);
      toast.success("File uploaded and parsed successfully!");
    } catch (error) {
      toast.error("Failed to upload or parse file");
      console.error(error);
    }
  };

  const handleBulkSubmit = async () => {
    if (subAdmins.length === 0) {
      toast.error("No sub-admins to upload");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/subadmin/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subAdmins }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Bulk upload processed successfully");
        setUploadSummary({
          success: data.created.length,
          failed: data.skipped.length,
          errors: data.skipped.map((s, idx) => ({
            row: idx + 1,
            error: s.reason,
          })),
        });
        setSubAdmins([]); // clear after upload
      } else {
        toast.error(data.error || "Bulk upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during bulk upload");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(subAdmins[idx]);
    setEditIndex(idx);

    // scroll into view smoothly
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = (idx) => {
    const updated = subAdmins.filter((_, i) => i !== idx);
    setSubAdmins(updated);
    toast.success("Sub-admin deleted successfully");
  };

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
            You are not authorized to view this page. If you have admin
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
      <AdminNavbar />
      {/* Added pt-24 to prevent navbar overlap */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-32 py-10 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome to your administrative panel
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, idx) => (
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

          {/* Add Sub-Admin Form */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300 max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              Add Sub-Admin
            </h2>
            <form
              ref={formRef}
              className="space-y-5"
              onSubmit={handleFormSubmit}
            >
              <div>
                <label className="block font-medium text-blue-700 mb-1">
                  Institute
                </label>
                <select
                  name="institute"
                  value={form.institute}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Institute</option>
                  {institutes?.map((inst) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-blue-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block font-medium text-blue-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label className="block font-medium text-blue-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="block font-medium text-blue-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  required
                  type="password"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Password"
                />
              </div>
              {/* Permissions checkboxes */}
              <div>
                <label className="block font-medium text-blue-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="manageCourses"
                      checked={form.permissions.manageCourses}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    Manage Courses
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="manageInstituteDetails"
                      checked={form.permissions.manageInstituteDetails}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    Manage Institute Details
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="addArticles"
                      checked={form.permissions.addArticles}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    Add Articles
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="addMeritLists"
                      checked={form.permissions.addMeritLists}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    Add Merit Lists
                  </label>
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-xl shadow transition duration-200"
                >
                  {editIndex !== null ? "Update Sub-Admin" : "Create Sub-Admin"}
                </button>
                <button
                  type="button"
                  onClick={handleFormReset}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-xl shadow transition duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Bulk Upload Section */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-300 max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              Bulk Upload Sub-Admins
            </h2>
            <div className="flex flex-col items-center gap-4">
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <UsersIcon className="w-10 h-10 text-blue-400 mb-2" />
                <span className="font-medium text-blue-700">
                  Drag & Drop or Choose File
                </span>
                <span className="text-sm text-gray-500">
                  Supported: .csv, .xlsx
                </span>
              </label>
              <a
                href="/sample-subadmin-template.xlsx"
                download
                className="text-blue-600 underline text-sm font-medium hover:text-blue-900"
              >
                Download Sample Template
              </a>
              {uploading && (
                <div className="w-full bg-blue-100 rounded-full h-3 mt-2">
                  <div
                    className="bg-blue-500 h-3 rounded-full animate-pulse"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              )}
              {uploadSummary && (
                <div className="w-full mt-4">
                  <div className="font-semibold text-green-700 mb-1">
                    {uploadSummary.success} sub-admins created successfully,{" "}
                    {uploadSummary.failed} failed
                  </div>
                  {uploadSummary.errors && uploadSummary.errors.length > 0 && (
                    <div className="text-red-600 text-sm">
                      Error rows:
                      <ul className="list-disc ml-4">
                        {uploadSummary.errors.map((err) => (
                          <li key={err.row}>
                            Row {err.row}: {err.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleBulkSubmit}
                disabled={uploading || subAdmins.length === 0}
                className="bg-blue-700 hover:bg-blue-900 text-white font-semibold px-6 py-2 rounded-xl shadow transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Submit Bulk Upload"}
              </button>
            </div>
          </div>

          {/* Sub-Admins Table */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 mx-auto mb-12 overflow-x-auto">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              All Sub-Admins
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                      Institute
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subAdmins?.map((admin, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {admin.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {admin.institute}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {admin.permissions
                          ? Object.entries(admin.permissions)
                              .filter(([_, v]) => v)
                              .map(([k]) => k)
                              .join(", ")
                          : "None"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(idx)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(idx)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
