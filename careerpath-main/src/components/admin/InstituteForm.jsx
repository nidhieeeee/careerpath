import React, { useState, useEffect } from 'react';

const InstituteForm = ({ data, setData, editIndex, formData, setFormData, setEditIndex }) => {
  useEffect(() => {
    if (editIndex !== null) {
      setFormData(data[editIndex]);
    } else {
      setFormData({
        courses: [{}],
      });
    }
  }, [editIndex, data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files?.length ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value,
    };
    setFormData({ ...formData, courses: updatedCourses });
  };

  const addMoreCourse = () => {
    setFormData({
      ...formData,
      courses: [...(formData.courses || []), {}],
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
    setFormData({ courses: [{}] });
    setEditIndex(null);
    alert(editIndex !== null ? "Updated successfully!" : "Added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-10 text-center">{editIndex !== null ? "Edit" : "Add"} Institute</h2>

      <div>
        <label className="block mb-1 font-medium">Institute Name</label>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Location</label>
        <input
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border border-blue-300 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Website/Link</label>
        <input
          name="link"
          value={formData.link || ''}
          onChange={handleChange}
          placeholder="Institute Link"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Affiliation</label>
        <select
          name="affiliation"
          value={formData.affiliation || ''}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded"
          required
        >
          <option value="">Select Affiliation</option>
          <option value="AICTE">AICTE</option>
          <option value="UGC">UGC</option>
          <option value="Autonomous">Autonomous</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder="Phone"
          type="tel"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full p-2 border border-blue-300 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Courses Offered</label>
        {(formData.courses || []).map((course, index) => (
          <div key={index} className="space-y-2 mb-4 p-4 border rounded bg-gray-50">
            <input
              type="text"
              value={course.name || ''}
              onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
              placeholder="Course Name"
              className="w-full p-2 border border-blue-300 rounded"
              required
            />
            <input
              type="text"
              value={course.duration || ''}
              onChange={(e) => handleCourseChange(index, 'duration', e.target.value)}
              placeholder="Duration"
              className="w-full p-2 border border-blue-300 rounded"
              required
            />
            <input
              type="number"
              value={course.fees || ''}
              onChange={(e) => handleCourseChange(index, 'fees', e.target.value)}
              placeholder="Fees"
              className="w-full p-2 border border-blue-300 rounded"
              required
            />
            <input
              type="number"
              value={course.seats || ''}
              onChange={(e) => handleCourseChange(index, 'seats', e.target.value)}
              placeholder="Seats"
              className="w-full p-2 border border-blue-300 rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMoreCourse}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add More Courses
        </button>
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

export default InstituteForm;
