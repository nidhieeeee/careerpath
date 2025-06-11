import React, { useState, useEffect } from 'react';

const CourseForm = ({ data, setData, editIndex, formData, setFormData, setEditIndex }) => {
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
    alert(editIndex !== null ? "Course updated successfully!" : "Course added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-10 text-center">{editIndex !== null ? "Edit" : "Add"} Course</h2>

      <div>
        <label className="block mb-1 font-medium">Course Title</label>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Course Title"
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
          placeholder="Course Description"
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
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="Diploma">Diploma</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Stream</label>
        <select
          name="stream"
          value={formData.stream || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        >
          <option value="">Select Stream</option>
          <option value="Science">Science</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Course Link</label>
        <input
          name="link"
          value={formData.link || ''}
          onChange={handleChange}
          placeholder="Course Link (optional)"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Photo</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
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

export default CourseForm;
