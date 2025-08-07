// store/useDataStore.js
import { create } from 'zustand';
import axios from 'axios';

const useDataStore = create((set) => ({
  courses: [],
  institutes: [],
  articles: [],
  loading: false,
  error: null,
  isAdmin:false,

  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const [coursesRes, institutesRes, articlesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/courses'),
        axios.get('http://localhost:5000/api/institutes'),
        axios.get('http://localhost:5000/api/articles'),
      ]);

      set({
        courses: coursesRes.data,
        institutes: institutesRes.data,
        articles: articlesRes.data,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
fetchInstitutes: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('http://localhost:5000/api/institutes');
      set({ institutes: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
    fetchCourses: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      set({ courses: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
    fetchCourses: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      set({ courses: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  adminLogin : ()=>{
    set({
      isAdmin:true
    })
  }
}));

export default useDataStore;
