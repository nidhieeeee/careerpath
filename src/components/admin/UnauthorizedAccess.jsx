import React from "react";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg w-full">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
          {/* Icon Container */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-6 shadow-lg">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-2">Unauthorized Access</p>

          {/* Description */}
          <p className="text-gray-500 mb-8 leading-relaxed">
            You don't have permission to view this page. Please log in with an
            administrator account or contact your system administrator for
            access.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Primary Button - Login */}
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Go to Login
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>

              <button
                onClick={() => navigate(-1)}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact{" "}
              <a
                href="mailto:admin@careerpath.com"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                admin@careerpath.com
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Common Reasons for This Error:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              You are not logged in to the system
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              Your session has expired
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              You don't have the required permissions
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              You're trying to access an admin-only area
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2025 CareerPath. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
