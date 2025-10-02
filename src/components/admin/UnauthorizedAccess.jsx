import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <ShieldAlert className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page. Please log in as an administrator.
        </p>
        <button
          onClick={() => navigate("/admin")}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;