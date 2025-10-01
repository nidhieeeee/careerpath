// store/useDataStore.js
import { create } from "zustand";
import axios from "axios";

const useDataStore = create((set) => ({
  courses: [],
  institutes: [],
  articles: [],
  loading: false,
  error: null,
  isLoggedIn: false,
  role: null, // "super" | "sub" | null

  // Fetch all public data
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const [coursesRes, institutesRes, articlesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/courses`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/articles`),
      ]);

      set({
        courses: Array.isArray(coursesRes.data) ? coursesRes.data : [],
        institutes: Array.isArray(institutesRes.data) ? institutesRes.data : [],
        articles: Array.isArray(articlesRes.data) ? articlesRes.data : [],
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

  // Login → save token + role in localStorage
  login: (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    set({ isLoggedIn: true, role });
  },

  // Logout → clear everything
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ isLoggedIn: false, role: null });
  },

  // Initialize state from localStorage (call once on app load)
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      set({ isLoggedIn: true, role });
    } else {
      set({ isLoggedIn: false, role: null });
    }
  },
}));

export default useDataStore;
