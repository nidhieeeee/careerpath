import React, { useState, useEffect } from 'react';

// A default empty state for creating a new merit list
const emptyFormState = {
  name: '',
  board: '',
  date: '',
  downloadUrl: '',
  isNew: true, // Default new lists to 'isNew'
};

const MeritListForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState(emptyFormState);

  // This effect populates the form when editing an existing list
  useEffect(() => {
    if (initialData) {
      // Format the date correctly for the date input field (YYYY-MM-DD)
      const formattedDate = initialData.date 
        ? new Date(initialData.date).toISOString().split('T')[0] 
        : "";
      setFormData({ ...emptyFormState, ...initialData, date: formattedDate });
    } else {
      setFormData(emptyFormState); // Reset for a new entry
    }
  }, [initialData]);

  // A single handler for all form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Use 'checked' for checkboxes, otherwise use 'value'
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the form's local state up to the parent component
    onSubmit(formData);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">List Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., HSC Science Merit List 2025"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Board */}
        <div>
          <label htmlFor="board" className="block text-sm font-medium text-gray-700">Board</label>
          <input
            id="board"
            name="board"
            value={formData.board}
            onChange={handleChange}
            placeholder="e.g., GSEB, CBSE"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Download URL */}
        <div className="md:col-span-2">
          <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700">Download URL</label>
          <input
            type="url"
            id="downloadUrl"
            name="downloadUrl"
            value={formData.downloadUrl}
            onChange={handleChange}
            placeholder="https://example.com/merit-list.pdf"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      {/* "Is New" Toggle */}
      <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-200">
        <input
          type="checkbox"
          id="isNew"
          name="isNew"
          checked={formData.isNew}
          onChange={handleChange}
          className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
        />
        <label htmlFor="isNew" className="font-medium text-gray-700">Display "New" Badge</label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-5 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update List' : 'Create List')}
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

export default MeritListForm;