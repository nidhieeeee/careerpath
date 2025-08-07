import React, { useState, useEffect } from 'react';

const ArticleForm = ({ data, setData, editIndex, formData, setFormData, setEditIndex }) => {
  useEffect(() => {
    if (editIndex !== null) {
      setFormData(data[editIndex]);
    } else {
      setFormData({});
    }
  }, [editIndex, data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files?.length ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...data];
    if (editIndex !== null) {
      updated[editIndex] = formData;
    } else {
      updated.push(formData);
    }
    setData(updated);
    setFormData({});
    setEditIndex(null);
    alert(editIndex !== null ? "Article updated successfully!" : "Article added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-10 text-center">{editIndex !== null ? "Edit" : "Add"} Article</h2>

      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Author Name</label>
        <input
          name="author"
          value={formData.author || ''}
          onChange={handleChange}
          placeholder="Written by"
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Article Description"
          rows={3}
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="exam">Exam</option>
          <option value="tips">Tips</option>
          <option value="courses">Courses</option>
          <option value="trends">Trends</option>
          <option value="scholarships">Scholarships</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Source / Link</label>
        <input
          name="link"
          value={formData.link || ''}
          onChange={handleChange}
          placeholder="Optional link to source"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Upload Image (Photo)</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded mb-2"
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Upload Document (PDF or Word)</label>
        <input
          type="file"
          name="document"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default ArticleForm;
