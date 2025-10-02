import { useState, useEffect, useCallback } from "react";
import axios from "../components/api/axios";
import { toast } from "react-toastify";

export const useInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstitutes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/institutes");
      setInstitutes(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      toast.error("Failed to fetch institutes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  const addInstitute = async (data) => {
    try {
      const res = await axios.post("/institutes", data);
      setInstitutes((prev) => [res.data.form, ...prev]);
      toast.success("Institute added successfully!");
      return true;
    } catch (err) {
      toast.error("Error adding institute.");
      console.error(err);
      return false;
    }
  };

  const editInstitute = async (id, data) => {
    try {
      const res = await axios.put(`/institutes/${id}`, data);
      setInstitutes((prev) =>
        prev.map((item) => (item._id === id ? res.data.institute : item))
      );
      toast.success("Institute updated successfully!");
      return true;
    } catch (err) {
      toast.error("Error updating institute.");
      console.error(err);
      return false;
    }
  };

  const removeInstitute = async (id) => {
    try {
      await axios.delete(`/institutes/${id}`);
      setInstitutes((prev) => prev.filter((i) => i._id !== id));
      toast.success("Institute deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete institute.");
      console.error(err);
    }
  };

  return {
    institutes,
    loading,
    refetch: fetchInstitutes,
    addInstitute,
    editInstitute,
    removeInstitute,
  };
};