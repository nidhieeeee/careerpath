import { create } from "zustand";
import axios from "axios"; // Ensure this is your pre-configured axios instance

const useDataStore = create((set) => ({
  courses: [],
  institutes: [],
  topInstitutes: [],
  articles: [],
  loading: false,
  error: null,
  isLoggedIn: false,
  role: null, // "super" | "sub" | null

  // --- ASYNC LOGIN ACTION ---
  // This action now handles the entire login flow.
  login: async (credentials, role) => {
    set({ loading: true, error: null });
    try {
      const endpoint = role === "super" ? "/auth/login" : "/auth/subadmin/login";
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}${endpoint}`, credentials);

      const { token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      set({ isLoggedIn: true, role, loading: false });
      
      // Return a structured success response
      return { success: true, message: res.data.message };

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid credentials.";
      console.error("Login Error:", err);
      set({ error: errorMessage, loading: false });
      
      // Return a structured error response
      return { success: false, message: errorMessage };
    }
  },

  // --- LOGOUT ACTION ---
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ isLoggedIn: false, role: null });
  },

  // --- INITIALIZE AUTH STATE ---
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      set({ isLoggedIn: true, role });
    } else {
      set({ isLoggedIn: false, role: null });
    }
  },

  // --- DATA FETCHING ACTIONS (Unchanged) ---
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const [coursesRes, institutesRes, articlesRes, topInstitutesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/courses`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/articles`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/institutes/top`),
      ]);

      set({
        courses: Array.isArray(coursesRes.data) ? coursesRes.data : [],
        institutes: Array.isArray(institutesRes.data) ? institutesRes.data : [],
        articles: Array.isArray(articlesRes.data) ? articlesRes.data : [],
        topInstitutes: Array.isArray(topInstitutesRes.data) ? topInstitutesRes.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("fetchAllData Error:", err);
      set({ error: err.message, loading: false });
    }
  },

  fetchInstitutes: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`);
      set({
        institutes: Array.isArray(res.data) ? res.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("fetchInstitutes Error:", err);
      set({ error: err.message, loading: false });
    }
  },

  fetchCourses: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses`);
      set({
        courses: Array.isArray(res.data) ? res.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("fetchCourses Error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useDataStore;