import React, { useState, useEffect } from 'react';

const MeritForm = ({ data, setData, editIndex, formData, setFormData, setEditIndex }) => {
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
    alert(editIndex !== null ? "Merit list updated successfully!" : "Merit list added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-10 text-center">{editIndex !== null ? "Edit" : "Add"} Merit List</h2>

      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Merit List Title"
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Board</label>
        <select
          name="board"
          value={formData.board || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        >
          <option value="">Select Board</option>
          <option value="Gujarat Board">Gujarat Board</option>
          <option value="Maharashtra Board">Maharashtra Board</option>
          <option value="CBSE">CBSE</option>
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
        <label className="block mb-1 font-medium">Upload Document</label>
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

export default MeritForm;
