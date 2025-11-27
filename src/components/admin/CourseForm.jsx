import React, { useEffect, useState } from "react";

const initialFormState = {
  courseId: "",
  name: "",
  duration: "",
  popularity: "",
  type: "",
  stream: "",
};

const CourseForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormState);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialFormState,
        ...initialData,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="courseId"
          placeholder="Course ID (unique)"
          value={formData.courseId}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />

        <input
          name="duration"
          placeholder="Duration (e.g. 4 Years)"
          value={formData.duration}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          name="popularity"
          placeholder="Popularity (e.g. High, Medium, Low)"
          value={formData.popularity}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="type"
          placeholder="Type (e.g. UG, PG, Diploma)"
          value={formData.type}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="stream"
          placeholder="Stream (e.g. Engineering, Management)"
          value={formData.stream}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg disabled:bg-indigo-400"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Course"
            : "Create Course"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseForm;