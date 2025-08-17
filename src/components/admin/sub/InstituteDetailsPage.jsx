import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../AdminNavbar";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { topInstitutes } from "../../../data/mockData"; // Adjust import if needed

export default function InstituteDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  // Find institute by id or use a default for demo
  const institute =
    topInstitutes.find((inst) => inst.id === id) || topInstitutes[0];

  return (
    <>
      <AdminNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold"
        >
          <ShieldCheckIcon className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">
            Institute Details
          </h2>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-blue-700">Name:</span>
              <span className="ml-2 text-gray-800">{institute.name}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Location:</span>
              <span className="ml-2 text-gray-800">
                {institute.location.city}, {institute.location.state}
                <br />
                <span className="text-gray-500 text-sm">
                  {institute.location.address}
                </span>
              </span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Type:</span>
              <span className="ml-2 text-gray-800">{institute.type}</span>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Contact:</span>
              <span className="ml-2 text-gray-800">{institute.contact}</span>
            </div>
            {/* Add more fields as per InstituteForm.jsx */}
          </div>
        </div>
        {/* Sub-Admin Panel: Only Articles Section Active */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8 mt-8">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Articles</h3>
          {/* Render articles for this institute here */}
          <div className="text-gray-600">No articles available.</div>
        </div>
      </div>
    </>
  );
}
