import React from "react";

const MeritListForm = ({
  formData,
  setFormData,
  editIndex,
  createMeritList,
  updateMeritList,
  cancelEdit
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      updateMeritList(formData._id, formData);
    } else {
      createMeritList(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Merit List Name"
        value={formData.name || ""}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="date"
        name="date"
        value={
          formData.date ? formData.date.split("T")[0] : ""
        }
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="board"
        placeholder="Board Name"
        value={formData.board || ""}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isNew"
          checked={formData.isNew || false}
          onChange={handleChange}
        />
        Is New?
      </label>
      <input
        name="downloadUrl"
        placeholder="Download URL"
        value={formData.downloadUrl || ""}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
        {editIndex !== null && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MeritListForm;
