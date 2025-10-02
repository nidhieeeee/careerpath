import React, { useState, useEffect } from "react";

const categories = ["Exams", "Tips", "Courses", "Trends", "Scholarships"];
const emptyFormState = {
  title: "",
  author: "",
  date: "",
  category: "",
  excerpt: "",
  content: "",
  thumbnail: null,
  downloadUrl: "",
};

const ArticleForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(emptyFormState);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      // Format date for the input field
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "";
      setFormData({ ...emptyFormState, ...initialData, date: formattedDate });
      if (typeof initialData.thumbnail === 'string') {
        setPreview(initialData.thumbnail);
      }
    } else {
      setFormData(emptyFormState);
      setPreview(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Article Title" className="p-2 border rounded" required />
        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" className="p-2 border rounded" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" required />
        <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
      </div>

      <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Short Excerpt (SEO friendly)" className="w-full p-2 border rounded" rows={3} required />
      <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Full Article Content (Markdown is supported)" className="w-full p-2 border rounded" rows={8} required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
            <input name="thumbnail" type="file" accept="image/*" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <input type="url" name="downloadUrl" value={formData.downloadUrl} onChange={handleChange} placeholder="Download URL (Optional)" className="w-full p-2 border rounded mt-4" />
          </div>
          {preview && (
            <div className="text-center">
                 <img src={preview} alt="Thumbnail Preview" className="w-48 h-auto object-cover rounded-lg inline-block shadow-md" />
            </div>
          )}
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg disabled:bg-indigo-400">
            {isSubmitting ? "Saving..." : (initialData ? "Update Article" : "Create Article")}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg">
            Cancel
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;