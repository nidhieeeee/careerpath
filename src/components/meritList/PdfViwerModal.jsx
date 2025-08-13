// components/PdfViewerModal.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { Worker } from '@react-pdf-viewer/core';
import {
  Viewer,
  SpecialZoomLevel,
} from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { X } from 'lucide-react';

const PdfViewerModal = ({ isOpen, onClose, fileUrl, title }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl w-full max-w-5xl h-[90vh] shadow-xl overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-700 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              className="text-white hover:text-red-300 transition"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="h-full overflow-hidden">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={SpecialZoomLevel.PageFit}
              />
            </Worker>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PdfViewerModal;
