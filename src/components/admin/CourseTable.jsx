import React from "react";
import { Loader2 } from "lucide-react";
import CourseRow from "./CourseRow";

const CourseTable = ({ courses, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700">No Courses Found</h3>
        <p className="text-gray-500 mt-2">
          Click &quot;Add Course&quot; to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Stream
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Popularity
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <CourseRow
                key={course._id}
                course={course}
                onEdit={() => onEdit(course)}
                onDelete={() => onDelete(course._id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;