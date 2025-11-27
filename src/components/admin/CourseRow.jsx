import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const CourseRow = ({ course, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {course.name}
        </div>
        <div className="text-xs text-gray-500">
          ID: {course.courseId}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div>{course.type || "—"}</div>
        <div className="text-xs text-gray-500">{course.stream || ""}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {course.duration}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {course.popularity || "—"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
        <button
          onClick={onEdit}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <Pencil size={16} className="mr-1" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center text-red-600 hover:text-red-900"
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </button>
      </td>
    </tr>
  );
};

export default CourseRow;
