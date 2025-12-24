import React, { useState, useEffect, useCallback } from 'react';
import { PdfViewer } from './components/PdfViewer';
import { Sidebar } from './components/Sidebar';
import { PixelCrop } from 'react-image-crop';
import { getCroppedImg } from './utils/canvasUtils';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  
  // Resizing State
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setPreviewUrl(null);
        setPreviewBlob(null);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  const handleCropComplete = async (crop: PixelCrop, canvas: HTMLCanvasElement) => {
    if (!crop.width || !crop.height) return;

    try {
      const blob = await getCroppedImg(canvas, crop, 'cropped-image.png');
      const url = URL.createObjectURL(blob);
      
      // Cleanup previous url to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewBlob(blob);
      setPreviewUrl(url);
    } catch (e) {
      console.error('Failed to create crop', e);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setPreviewBlob(null);
  };

  // Resizing Logic
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - mouseMoveEvent.clientX;
        if (newWidth > 200 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md z-30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <h1 className="text-xl font-bold tracking-tight">PDF Cropper</h1>
        </div>
        
        <div className="flex items-center">
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <span>Upload PDF</span>
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Workspace Area */}
        <main className="flex-1 bg-slate-200 p-4 overflow-hidden relative flex flex-col min-w-0">
          {!selectedFile ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-100/50">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700">No PDF Loaded</h3>
              <p className="text-sm mt-1 mb-6">Upload a document to start cropping.</p>
              <label className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                Select a file from your computer
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          ) : (
            <PdfViewer 
              file={selectedFile} 
              onCropComplete={handleCropComplete} 
            />
          )}
        </main>

        {/* Resizer Handle */}
        <div 
          className="w-1 bg-slate-300 hover:bg-indigo-500 cursor-col-resize flex-shrink-0 z-40 transition-colors"
          onMouseDown={startResizing}
        ></div>

        {/* Sidebar */}
        <Sidebar 
          width={sidebarWidth}
          previewUrl={previewUrl} 
          previewBlob={previewBlob} 
          onClear={clearPreview}
        />
      </div>
    </div>
  );
};

export default App;