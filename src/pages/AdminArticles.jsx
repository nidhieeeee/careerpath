import React, { useEffect, useRef, useState } from 'react';
import axios from '../components/api/axios';
import { toast } from 'react-toastify';
import useDataStore from '../store/useDataStore';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/admin/AdminNavbar';
import { ShieldAlert } from 'lucide-react';


const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: '',
    category: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    downloadUrl: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const { isAdmin } = useDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      console.warn("Unauthorized access attempt to Admin Articles page.");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/articles');
        setArticles(res.data.reverse());
      } catch (err) {
        toast.error('Failed to fetch articles');
      }
    };

    fetchArticles();
  }, []);

  if (!isAdmin) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-6">
          You are not authorized to view this page.  
          If you have admin credentials, please log in by clicking the button below.
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "curio_community");
    data.append("cloud_name", "ddamnzrvc");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/ddamnzrvc/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl = formData.thumbnail;
      if (typeof thumbnailUrl === 'object') {
        thumbnailUrl = await uploadToCloudinary(thumbnailUrl);
      }

      const payload = { ...formData, thumbnail: thumbnailUrl };

      if (editIndex !== null) {
        const id = articles[editIndex]._id;
        const res = await axios.put(`/articles/${id}`, payload);
        const updated = articles.map((item, idx) =>
          idx === editIndex ? res.data.article : item
        );
        setArticles(updated);
        toast.success('Article updated');
      } else {
        const res = await axios.post('/articles/admin/create', payload);
        // console.log('New Article Created:', res.data);
        setArticles((prev) => [res.data, ...prev]);
        toast.success('Article added');
      }

      setFormData({
        title: '',
        author: '',
        date: '',
        category: '',
        excerpt: '',
        content: '',
        thumbnail: '',
        downloadUrl: ''
      });
      setEditIndex(null);
      scrollToList();
    } catch (err) {
      toast.error('Error saving article');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (index) => {
    setFormData(articles[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['all', 'Exams', 'Tips', 'Courses', 'Trends', 'Scholarships'];

  const cancelEdit = () => {
    setFormData({
      title: '',
      author: '',
      date: '',
      category: '',
      excerpt: '',
      content: '',
      thumbnail: '',
      downloadUrl: ''
    });
    setEditIndex(null);
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`/articles/admin/${id}`);
      setArticles(articles.filter((a) => a._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const scrollToList = () => {
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center drop-shadow-sm">
            Admin Dashboard – Articles
          </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200 space-y-4"
        >
          {/* Title */}
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Article Title"
            className="w-full p-2 border rounded"
            required
          />

          {/* Author */}
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author Name"
            className="w-full p-2 border rounded"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Excerpt */}
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short Excerpt / Summary"
            className="w-full p-2 border rounded"
            rows={3}
            required
          />

          {/* Content */}
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Full Article Content"
            className="w-full p-2 border rounded"
            rows={6}
            required
          />

          {/* Thumbnail */}
          {editIndex !== null && typeof formData.thumbnail === 'string' && (
            <div>
              <img
                src={formData?.thumbnail}
                alt="Current Thumbnail"
                className="w-40 h-24 object-cover rounded mb-2"
              />
            </div>
          )}
          <input
            name="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            {...(editIndex === null && { required: true })}
          />

          {/* Download URL */}
          <input
            type="url"
            name="downloadUrl"
            value={formData.downloadUrl}
            onChange={handleChange}
            placeholder="Download URL (optional)"
            className="w-full p-2 border rounded"
          />

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? 'Submitting...' : editIndex !== null ? 'Update Article' : 'Add Article'}
            </button>
            {editIndex !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>


          <div ref={listRef} className="mt-14">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Articles List
            </h2>

            {articles.length === 0 ? (
              <p className="text-center text-gray-500 italic">No articles yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <div
                    key={article._id}
                    className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col justify-between h-full transition hover:shadow-xl"
                  >
                    <div className="space-y-2">
                      <img
                        src={article.thumbnail || 'https://via.placeholder.com/400x200'}
                        alt={article.title}
                        className="w-full h-40 object-cover rounded"
                      />
                      <h3 className="text-xl font-bold text-blue-800">{article.title}</h3>
                      <p className="text-sm text-gray-600 italic">By {article.author} — {article.date}</p>
                      <p className="text-gray-700 text-sm">{article.excerpt}</p>
                      <p className="text-xs text-blue-600">Category: {article.category}</p>

                      {article.downloadUrl && (
                        <a
                          href={article.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline text-sm"
                        >
                          Download / Visit
                        </a>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteArticle(article._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminArticles;
