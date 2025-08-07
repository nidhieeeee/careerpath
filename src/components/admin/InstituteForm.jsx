// components/admin/InstituteForm.jsx
import React, { useEffect } from 'react';

const InstituteForm = ({
  formData,
  setFormData,
  editIndex,
  createInstitute,
  updateInstitute,
  cancelEdit,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('location.')) {
      const [_, key] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      courses: updatedCourses,
    }));
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [...(prev.courses || []), { name: '', duration: '', fees: '', seats: '', finance_type: 'self' }],
    }));
  };

  const removeCourse = (index) => {
    const updatedCourses = [...(formData.courses || [])];
    updatedCourses.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      courses: updatedCourses,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      updateInstitute(formData._id, formData);
    } else {
      createInstitute(formData);
    }
    setFormData({});
  };

  useEffect(() => {
    // ensure structure
    if (!formData.location) {
      setFormData((prev) => ({ ...prev, location: {} }));
    }
    if (!formData.courses) {
      setFormData((prev) => ({ ...prev, courses: [] }));
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editIndex !== null ? 'Edit' : 'Add'} Institute</h2>

      {/* Institute Basic Info */}
      <input
        type="text"
        name="name"
        placeholder="Institute Name"
        value={formData.name || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
        required
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={formData.imageUrl || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
      />

      <input
        type="text"
        name="location.city"
        placeholder="City"
        value={formData.location?.city || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
        required
      />

      <input
        type="text"
        name="location.state"
        placeholder="State"
        value={formData.location?.state || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
      />

      <input
        type="text"
        name="location.address"
        placeholder="Address"
        value={formData.location?.address || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
        required
      />

      <input
        type="text"
        name="website"
        placeholder="Website"
        value={formData.website || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
      />

      <input
        type="text"
        name="affilication"
        placeholder="Affiliation"
        value={formData.affilication || ''}
        onChange={handleChange}
        className="block w-full border border-gray-300 p-2 mb-3 rounded"
      />

      {/* Courses Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Courses</h3>
          <button
            type="button"
            onClick={addCourse}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded"
          >
            + Add Course
          </button>
        </div>

        {(formData.courses || []).map((course, idx) => (
          <div key={idx} className="border p-4 rounded mb-4 space-y-2 bg-gray-50">
            <input
              type="text"
              placeholder="Course Name"
              value={course.name || ''}
              onChange={(e) => handleCourseChange(idx, 'name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="Duration"
              value={course.duration || ''}
              onChange={(e) => handleCourseChange(idx, 'duration', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="number"
              placeholder="Fees"
              value={course.fees || ''}
              onChange={(e) => handleCourseChange(idx, 'fees', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              placeholder="Seats"
              value={course.seats || ''}
              onChange={(e) => handleCourseChange(idx, 'seats', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <select
              value={course.finance_type || 'self'}
              onChange={(e) => handleCourseChange(idx, 'finance_type', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="self">Self Finance</option>
              <option value="government">Government</option>
              <option value="aided">Aided</option>
            </select>
            <button
              type="button"
              onClick={() => removeCourse(idx)}
              className="text-sm text-red-600 mt-2 underline"
            >
              Remove Course
            </button>
          </div>
        ))}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 mt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editIndex !== null ? 'Update' : 'Create'}
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
  );
};

export default InstituteForm;
