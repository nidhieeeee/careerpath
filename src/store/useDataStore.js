import { create } from "zustand";
import axios from "axios";

// Utility: Alphabetical sorting helper
const alphaSort = (arr, key) => {
  if (!Array.isArray(arr)) return [];
  return [...arr].sort((a, b) =>
    a[key]?.toString().localeCompare(b[key]?.toString())
  );
};

const useDataStore = create((set) => ({
  courses: [],
  institutes: [],
  topInstitutes: [],
  articles: [],
  loading: false,
  error: null,
  isLoggedIn: false,
  role: null,

  // ------------------ LOGIN ------------------
  login: async (credentials, role) => {
    set({ loading: true, error: null });

    try {
      const endpoint =
        role === "super" ? "/auth/login" : "/auth/subadmin/login";

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${endpoint}`,
        credentials
      );

      const { token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      set({ isLoggedIn: true, role, loading: false });

      return { success: true, message: res.data.message };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid credentials.";
      console.error("Login Error:", err);

      set({ error: errorMessage, loading: false });
      return { success: false, message: errorMessage };
    }
  },

  // ------------------ LOGOUT ------------------
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ isLoggedIn: false, role: null });
  },

  // ------------------ AUTH INIT ------------------
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      set({ isLoggedIn: true, role });
    } else {
      set({ isLoggedIn: false, role: null });
    }
  },

  // ------------------ FETCH ALL DATA ------------------
  fetchAllData: async () => {
    set({ loading: true, error: null });

    try {
      const [coursesRes, institutesRes, articlesRes, topInstitutesRes] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/courses`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/articles`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/institutes/top`),
        ]);

      set({
        courses: alphaSort(
          Array.isArray(coursesRes.data) ? coursesRes.data : [],
          "name"
        ),
        institutes: alphaSort(
          Array.isArray(institutesRes.data) ? institutesRes.data : [],
          "name"
        ),
        articles: alphaSort(
          Array.isArray(articlesRes.data) ? articlesRes.data : [],
          "title"
        ),
        topInstitutes: alphaSort(
          Array.isArray(topInstitutesRes.data) ? topInstitutesRes.data : [],
          "name"
        ),
        loading: false,
      });
    } catch (err) {
      console.error("fetchAllData Error:", err);
      set({ error: err.message, loading: false });
    }
  },

  // ------------------ FETCH ONLY INSTITUTES ------------------
  fetchInstitutes: async () => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/institutes`
      );

      set({
        institutes: alphaSort(
          Array.isArray(res.data) ? res.data : [],
          "name"
        ),
        loading: false,
      });
    } catch (err) {
      console.error("fetchInstitutes Error:", err);
      set({ error: err.message, loading: false });
    }
  },

  // ------------------ FETCH ONLY COURSES ------------------
  fetchCourses: async () => {
    set({ loading: true });

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses`
      );

      set({
        courses: alphaSort(
          Array.isArray(res.data) ? res.data : [],
          "name"
        ),
        loading: false,
      });
    } catch (err) {
      console.error("fetchCourses Error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useDataStore;
