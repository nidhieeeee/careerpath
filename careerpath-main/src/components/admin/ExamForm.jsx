import React, { useState, useEffect } from 'react';

const ExamForm = ({ data, setData, editIndex, formData, setFormData, setEditIndex }) => {
  useEffect(() => {
    if (editIndex !== null) {
      setFormData(data[editIndex]);
    } else {
      setFormData({});
    }
  }, [editIndex, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    alert(editIndex !== null ? "Exam updated successfully!" : "Exam added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-10 text-center">{editIndex !== null ? "Edit" : "Add"} Exam</h2>

      <div>
        <label className="block mb-1 font-medium">Exam Title</label>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Enter Exam Title"
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type of Exam</label>
        <select
          name="type"
          value={formData.type || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="Government Exam">Government Exam</option>
          <option value="Entrance Exam">Entrance Exam</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Exam Date</label>
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
        <label className="block mb-1 font-medium">Category</label>
        <input
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          placeholder="Enter Exam Category"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Level</label>
        <select
          name="level"
          value={formData.level || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        >
          <option value="">Select Level</option>
          <option value="National">National</option>
          <option value="State">State</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        {editIndex !== null ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default ExamForm;
