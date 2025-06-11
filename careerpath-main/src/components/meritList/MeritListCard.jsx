import React from 'react';
import { Download, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';


const MeritListCard = ({ meritList }) => {
  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    toast.success('Download started!');
    window.open(meritList.downloadUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-4">
      <div className="flex items-start">
        <div className="bg-blue-100 p-3 rounded-lg mr-4">
          <FileText className="w-6 h-6 text-blue-800" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800">{meritList.name}</h3>
            {meritList.isNew && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                New
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{meritList.date}</span>
          </div>
          
          <div className="flex items-center text-xs font-medium text-gray-600 mb-3">
            <span className="bg-gray-100 px-2 py-1 rounded-full">{meritList.board}</span>
          </div>
          
          <button
            onClick={handleDownload}
            className="flex items-center text-sm text-blue-700 hover:text-blue-900 font-medium"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeritListCard;