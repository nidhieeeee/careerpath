import { useState, useEffect, useCallback } from "react";
import axios from "../components/api/axios";
import { toast } from "react-toastify";

// Helper function for Cloudinary upload
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "curio_community"); // Replace with your preset
  data.append("cloud_name", "ddamnzrvc"); // Replace with your cloud name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/ddamnzrvc/image/upload", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    if (!result.secure_url) {
        throw new Error("Image upload failed, no secure_url returned.");
    }
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    throw new Error("Image upload failed");
  }
};

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/articles");
      setArticles(res.data.reverse());
    } catch (err) {
      toast.error("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const addArticle = async (formData) => {
    try {
      let payload = { ...formData };
      if (formData.thumbnail && typeof formData.thumbnail === "object") {
        const thumbnailUrl = await uploadToCloudinary(formData.thumbnail);
        payload.thumbnail = thumbnailUrl;
      }

      const res = await axios.post("/articles/admin/create", payload);
      setArticles((prev) => [res.data, ...prev]);
      toast.success("Article added successfully!");
      return true;
    } catch (err) {
      toast.error("Error adding article.");
      return false;
    }
  };

  const updateArticle = async (id, formData) => {
    try {
        let payload = { ...formData };
        if (formData.thumbnail && typeof formData.thumbnail === "object") {
          const thumbnailUrl = await uploadToCloudinary(formData.thumbnail);
          payload.thumbnail = thumbnailUrl;
        }

        const res = await axios.put(`/articles/${id}`, payload);
        setArticles((prev) =>
            prev.map((article) => (article._id === id ? res.data.article : article))
        );
        toast.success("Article updated successfully!");
        return true;
    } catch (err) {
        toast.error("Error updating article.");
        return false;
    }
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`/articles/admin/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      toast.success("Article deleted.");
    } catch (err) {
      toast.error("Failed to delete article.");
    }
  };

  return { articles, loading, fetchArticles, addArticle, updateArticle, deleteArticle };
};