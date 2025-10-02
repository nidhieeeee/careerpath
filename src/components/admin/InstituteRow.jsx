import React, { useState } from 'react';
// 1. Import the Building2 icon
import { Edit, Trash2, Star, Globe, Building2 } from 'lucide-react';

const InstituteRow = ({ institute, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    onDelete();
    setShowConfirm(false);
  };
  
  const naacGrade = institute.rankings?.naac?.[0]?.grade || 'N/A';
  const nirfRank = institute.rankings?.nirf?.[0]?.rank || 'N/A';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {/* 2. Conditionally render the image or the icon */}
            {institute.imageUrl ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={institute.imageUrl}
                alt={institute.name}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
              {institute.name}
              {institute.isTopInstitute && (
                 <span title="Top Institute" className="text-yellow-500"><Star size={16} /></span>
              )}
            </div>
            <div className="text-xs text-gray-500">{institute.instituteCode}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{institute.location?.city}</div>
        <div className="text-sm text-gray-500">{institute.location?.state}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {institute.courses?.length || 0} Courses
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-3">
           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            NIRF: {nirfRank}
           </span>
           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            NAAC: {naacGrade}
           </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
           <a href={institute.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600" title="Visit Website">
              <Globe size={18} />
           </a>
           <button onClick={onEdit} className="text-gray-400 hover:text-indigo-600" title="Edit">
              <Edit size={18} />
           </button>
           <div className="relative">
             <button onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-red-600" title="Delete">
               <Trash2 size={18} />
             </button>
             {showConfirm && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3">
                   <p className="text-xs text-gray-600 text-left">Are you sure?</p>
                   <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setShowConfirm(false)} className="text-xs px-2 py-1 rounded-md hover:bg-gray-100">Cancel</button>
                      <button onClick={handleDeleteClick} className="text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                   </div>
                </div>
             )}
           </div>
        </div>
      </td>
    </tr>
  );
};

export default InstituteRow;