// store/useDataStore.js
import { create } from 'zustand';
import axios from 'axios';

const useDataStore = create((set) => ({
  courses: [],
  institutes: [],
  articles: [],
  loading: false,
  error: null,
  isAdmin: false,

  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const [coursesRes, institutesRes, articlesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/courses`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/articles`),
      ]);

      console.log("Courses API Response:", coursesRes.data);
      console.log("Institutes API Response:", institutesRes.data);
      console.log("Articles API Response:", articlesRes.data);

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
      console.log("Institutes API Response:", res.data);
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
      console.log("Courses API Response:", res.data);
      set({
        courses: Array.isArray(res.data) ? res.data : [],
        loading: false,
      });
    } catch (err) {
      console.error("fetchCourses Error:", err);
      set({ error: err.message, loading: false });
    }
  },

  adminLogin: () => {
    set({ isAdmin: true });
  },
}));

export default useDataStore;
