import React from 'react';
import MeritListRow from './MeritListRow';
import { Loader2 } from 'lucide-react';

const MeritListTable = ({ meritLists, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!meritLists || meritLists.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-medium text-gray-700">No Merit Lists Found</h3>
        <p className="text-gray-500 mt-2">Click "Add Merit List" to upload one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">List Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {meritLists.map((list) => (
            <MeritListRow
              key={list._id}
              meritList={list}
              onEdit={() => onEdit(list)}
              onDelete={() => onDelete(list._id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeritListTable;