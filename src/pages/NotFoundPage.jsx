import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  HomeIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <ShieldExclamationIcon className="w-12 h-12 text-red-600" />
          </div>

          {/* Content */}
          <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-base mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md"
            >
              <HomeIcon className="w-5 h-5" />
              Go to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-8">
            If you believe this is an error, please contact support.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-blue-200 text-opacity-30">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 5h2v7H9V5zm0 9h2v2H9v-2z" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 text-indigo-200 text-opacity-30">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
