import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Eye, EyeOff } from "lucide-react";
import useDataStore from "../../store/useDataStore";

export default function Adminlogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [role, setRole] = useState("super");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();

  // Get the login action and loading state directly from the store
  const { login, loading: isLoggingIn } = useDataStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous local errors

    // Call the login action from the store
    const result = await login(credentials, role);

    if (result.success) {
      toast.success(result.message || "Login successful!");
      // Navigate based on the role
      if (role === "super") {
        navigate("/admin/dashboard");
      } else {
        navigate("/subadmin/dashboard");
      }
    } else {
      // Set local error state to display the message in the form
      setError(result.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      toast.error("Please enter your email address first");
      return;
    }

    setIsResettingPassword(true);
    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Password reset link sent to your email!");
      setError("");
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-4 rounded-full shadow-lg mb-4">
            <img
              src="/logoCP.png"
              alt="CareerPath Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {role === "super" ? "Super Admin Login" : "Sub-Admin Login"}
          </h2>
          <p className="text-gray-600">
            Welcome back! Please login to continue
          </p>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-xl border border-blue-100">
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-xl text-center mb-6 font-medium border border-red-200 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Role Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex rounded-xl border-2 border-blue-200 p-1.5 bg-blue-50">
              <button
                type="button"
                onClick={() => setRole("super")}
                className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === "super"
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("sub")}
                className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  role === "sub"
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Sub-Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isResettingPassword}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors disabled:text-blue-400 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isResettingPassword && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isResettingPassword ? "Sending..." : "Forgot Password?"}
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center items-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoggingIn ? "Signing In..." : "Login"}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                🔒 Your session will remain active for 7 days
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
