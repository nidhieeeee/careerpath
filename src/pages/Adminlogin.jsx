import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import useDataStore from "../store/useDataStore";

export default function Adminlogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [role, setRole] = useState("super");
  const [error, setError] = useState("");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {role === "super" ? "Super Admin Login" : "Sub-Admin Login"}
        </h2>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg text-center mb-4 font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-100">
            <button
              type="button"
              onClick={() => setRole("super")}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
                role === "super"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("sub")}
              className={`px-6 py-2 text-sm font-semibold rounded-md transition-colors ${
                role === "sub"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Sub-Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center items-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingIn && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoggingIn ? "Signing In..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
