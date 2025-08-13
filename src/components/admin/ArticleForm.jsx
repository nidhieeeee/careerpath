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
    const { name, value, files, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file'
        ? URL.createObjectURL(files[0])
        : type === 'checkbox'
        ? checked
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...data];
    if (editIndex !== null) {
      updated[editIndex] = formData;
    } else {
      updated.push({ ...formData, id: Date.now().toString() }); // generate unique ID
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
        <label className="block mb-1 font-medium">Author</label>
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
        <label className="block mb-1 font-medium">Excerpt</label>
        <textarea
          name="excerpt"
          value={formData.excerpt || ''}
          onChange={handleChange}
          placeholder="Short summary"
          className="w-full p-2 border border-blue-300 rounded"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Full Content</label>
        <textarea
          name="content"
          value={formData.content || ''}
          onChange={handleChange}
          placeholder="Full article content"
          className="w-full p-2 border border-blue-300 rounded"
          rows={5}
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
          <option value="Tips">Tips</option>
          <option value="Exams">Exams</option>
          <option value="Courses">Courses</option>
          <option value="Trends">Trends</option>
          <option value="Scholarships">Scholarships</option>
        </select>
      </div>

      {formData.category === "Scholarships" && (
        <div>
          <label className="block mb-1 font-medium">Board (Scholarship Only)</label>
          <input
            name="board"
            value={formData.board || ''}
            onChange={handleChange}
            placeholder="E.g. Central Board"
            className="w-full p-2 border border-blue-300 rounded"
          />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Upload Thumbnail</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">External Link (PDF or Website)</label>
        <input
          type="url"
          name="downloadUrl"
          value={formData.downloadUrl || ''}
          onChange={handleChange}
          placeholder="e.g. https://example.com"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured || false}
            onChange={handleChange}
          />
          <span>Feature this article</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isNew"
            checked={formData.isNew || false}
            onChange={handleChange}
          />
          <span>Mark as New</span>
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default ArticleForm;
