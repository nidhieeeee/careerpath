import React, { useState, useRef } from "react";
import useDataStore from "../store/useDataStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AdminNavbar from "../components/admin/AdminNavbar";
import {
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  NewspaperIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    label: "Total Institutes",
    value: 24,
    icon: AcademicCapIcon,
    desc: "Registered institutes",
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Total Courses",
    value: 120,
    icon: BookOpenIcon,
    desc: "Available courses",
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Total Merits",
    value: 18,
    icon: DocumentTextIcon,
    desc: "Published merit lists",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    label: "Total Articles",
    value: 56,
    icon: NewspaperIcon,
    desc: "Published articles",
    color: "bg-pink-100 text-pink-700",
  },
];

const institutes = ["IIT Delhi", "IIM Ahmedabad", "NIT Surat", "NIPER Mohali"];

export default function AdminDashboard() {
  const { isAdmin } = useDataStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    institute: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [subAdmins, setSubAdmins] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const formRef = useRef(null);

  // Handlers
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...subAdmins];
      updated[editIndex] = { ...form, status: "Active" };
      setSubAdmins(updated);
      toast.success("Sub-admin updated successfully");
    } else {
      setSubAdmins([...subAdmins, { ...form, status: "Active" }]);
      toast.success("Sub-admin created successfully");
    }
    setForm({ institute: "", name: "", email: "", phone: "", password: "" });
    setEditIndex(null);
  };

  const handleFormReset = () => {
    setForm({ institute: "", name: "", email: "", phone: "", password: "" });
    setEditIndex(null);
  };

  const handleFileUpload = (e) => {
    setUploading(true);
    // simulate processing
    setTimeout(() => {
      setUploading(false);
      setUploadSummary({
        success: 10,
        failed: 2,
        errors: [
          { row: 3, error: "Invalid email" },
          { row: 7, error: "Missing name" },
        ],
      });
    }, 2000);
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            {/* Replace ShieldAlert with a valid icon if not imported */}
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
            onClick={() => navigate("/admin")}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-10 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl shadow-lg p-6 flex flex-col items-center ${stat.color}`}
              >
                <stat.icon className="w-10 h-10 mb-2" />
                <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
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
                  {institutes.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
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
              <div className="flex gap-4 justify-end mt-2">
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
                  {uploadSummary.errors.length > 0 && (
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
          </div>

          {/* Sub-Admins Table */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 max-w-5xl mx-auto mb-12 overflow-x-auto">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              All Sub-Admins
            </h2>
            <table className="min-w-full divide-y divide-blue-100">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                    Institute
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-blue-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subAdmins.map((admin, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {admin.name}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{admin.email}</td>
                    <td className="px-4 py-2 text-gray-700">
                      {admin.institute}
                    </td>
                    <td className="px-4 py-2 text-green-700 font-semibold">
                      {admin.status}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow flex items-center gap-1"
                        onClick={() => handleEdit(idx)}
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow flex items-center gap-1"
                        onClick={() => handleDelete(idx)}
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
