import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  Download,
  Calendar,
  FileText,
  Eye,
  X,
  Maximize,
  Minimize,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MeritListCard = ({ meritList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleDownload = () => {
    toast.success('Download started!');
    window.open(meritList.downloadUrl, '_blank');
  };

  return (
    <>
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
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                {meritList.board}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for PDF Viewer */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={`bg-white rounded-xl shadow-xl overflow-hidden relative transition-all duration-300 ${
              isFullScreen
                ? 'w-screen h-screen max-w-none'
                : 'w-full max-w-4xl h-[90vh]'
            }`}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-red-600 transition"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Full Screen Toggle */}
            <button
              className="absolute top-4 right-14 text-white hover:text-gray-600 transition"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Maximize className="w-6 h-6" />
              )}
            </button>

            {/* Modal Title */}
            <div className="bg-blue-700 text-white px-6 py-4 text-lg font-semibold">
              {meritList.name}
            </div>

            {/* PDF Iframe */}
            <div className="h-full w-full">
              <iframe
                src={meritList.downloadUrl}
                title="Merit List Viewer"
                className="w-full h-[calc(100%-56px)]"
              ></iframe>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MeritListCard;
