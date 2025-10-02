import React from "react";
import InstituteRow from "./InstituteRow";
import { Loader2 } from "lucide-react";

const InstituteTable = ({ institutes, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (institutes.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700">No Institutes Found</h3>
        <p className="text-gray-500 mt-2">
          Click "Add Institute" to get started.
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rankings</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {institutes.map((inst) => (
              <InstituteRow
                key={inst._id}
                institute={inst}
                onEdit={() => onEdit(inst)}
                onDelete={() => onDelete(inst._id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstituteTable;