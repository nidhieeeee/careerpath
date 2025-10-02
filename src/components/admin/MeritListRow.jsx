import React from 'react';
import { Edit, Trash2, Download } from 'lucide-react';

const MeritListRow = ({ meritList, onEdit, onDelete }) => {
  const formattedDate = new Date(meritList.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-semibold text-gray-900">{meritList.name}</div>
          {meritList.isNew && (
            <span className="ml-3 px-2 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              New
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{meritList.board}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formattedDate}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-4">
          <a href={meritList.downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800" title="Download">
            <Download size={16} /> Download
          </a>
          <button onClick={onEdit} className="text-gray-400 hover:text-gray-800" title="Edit">
            <Edit size={18} />
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-600" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MeritListRow;