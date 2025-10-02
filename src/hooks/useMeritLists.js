import { useState, useEffect, useCallback } from "react";
import axios from "../components/api/axios";
import { toast } from "react-toastify";

export const useMeritLists = () => {
  const [meritLists, setMeritLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeritLists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/merit-lists");
      setMeritLists(res.data.reverse());
    } catch (err) {
      toast.error("Failed to fetch merit lists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeritLists();
  }, [fetchMeritLists]);

  const addMeritList = async (formData) => {
    try {
      const res = await axios.post("/merit-lists", formData);
      setMeritLists((prev) => [res.data, ...prev]);
      toast.success("Merit list added successfully!");
      return true;
    } catch (err) {
      toast.error("Error adding merit list.");
      return false;
    }
  };

  const updateMeritList = async (id, formData) => {
    try {
      const res = await axios.put(`/merit-lists/${id}`, formData);
      setMeritLists((prev) =>
        prev.map((list) => (list._id === id ? res.data : list))
      );
      toast.success("Merit list updated successfully!");
      return true;
    } catch (err) {
      toast.error("Error updating merit list.");
      return false;
    }
  };

  const deleteMeritList = async (id) => {
    try {
      await axios.delete(`/merit-lists/${id}`);
      setMeritLists((prev) => prev.filter((list) => list._id !== id));
      toast.success("Merit list deleted.");
    } catch (err) {
      toast.error("Failed to delete merit list.");
    }
  };

  return { meritLists, loading, addMeritList, updateMeritList, deleteMeritList };
};