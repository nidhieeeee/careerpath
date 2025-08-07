import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../components/api/axios"; // or your axios config
import useDataStore from "../store/useDataStore";

export default function Adminlogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { adminLogin } = useDataStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", credentials);
      alert(res.data.message);
      adminLogin();
      navigate("/admin/institute");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-blue-300">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Admin Login</h2>

        {error && (
          <div className="text-red-500 text-center mb-4 font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-blue-800">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block font-medium text-blue-800">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="********"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
