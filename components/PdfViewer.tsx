import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from './Button';
import { initPdfWorker } from '../utils/pdfWorker';

// Initialize worker immediately
initPdfWorker();

interface PdfViewerProps {
  file: File;
  onCropComplete: (crop: PixelCrop, image: HTMLCanvasElement) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ file, onCropComplete }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Document
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Handle ESM default export inconsistencies
        const lib = pdfjsLib as any;
        const getDocument = lib.getDocument || lib.default?.getDocument;
        
        if (!getDocument) {
          throw new Error("PDF.js getDocument function not found");
        }

        const loadingTask = getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
        setPageNum(1);
      } catch (err: any) {
        console.error("Error loading PDF", err);
        setError("Failed to load PDF. Please ensure it is a valid file.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPdf();
  }, [file]);

  // Render Page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      // We want high resolution for cropping, but fit in view
      const viewport = page.getViewport({ scale: scale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext as any).promise;
      
      // Reset crop when page changes
      setCrop(undefined);
      setCompletedCrop(undefined);
      
    } catch (err) {
      console.error("Error rendering page", err);
      setError("Error rendering page.");
    }
  }, [pdfDoc, pageNum, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  const changePage = (offset: number) => {
    const newPage = pageNum + offset;
    if (newPage >= 1 && newPage <= pageCount) {
      setPageNum(newPage);
    }
  };

  const handleCropConfirm = () => {
    if (completedCrop && canvasRef.current) {
      onCropComplete(completedCrop, canvasRef.current);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-lg shadow-inner overflow-hidden border border-slate-200">
      {/* Toolbar */}
      <div className="bg-white p-3 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-100 rounded-md p-1">
            <button 
              onClick={() => changePage(-1)}
              disabled={pageNum <= 1}
              className="p-1 hover:bg-white rounded disabled:opacity-30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-medium text-slate-700 w-20 text-center">
              Page {pageNum} / {pageCount}
            </span>
            <button 
              onClick={() => changePage(1)}
              disabled={pageNum >= pageCount}
              className="p-1 hover:bg-white rounded disabled:opacity-30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 border-l pl-4 border-slate-300">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Zoom</span>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1 text-slate-600 hover:text-indigo-600 font-bold text-lg">-</button>
            <span className="text-sm text-slate-700 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(3.0, s + 0.2))} className="p-1 text-slate-600 hover:text-indigo-600 font-bold text-lg">+</button>
          </div>
        </div>

        <div>
          {completedCrop && (
             <Button onClick={handleCropConfirm} className="animate-pulse">
                Capture Selection
             </Button>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-50 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center">
               <svg className="animate-spin h-8 w-8 text-indigo-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-slate-600 text-sm">Rendering PDF...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 my-auto bg-red-50 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="relative shadow-xl border border-slate-300 bg-white">
           <ReactCrop 
            crop={crop} 
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="block"
           >
            <canvas ref={canvasRef} className="block max-w-none" />
          </ReactCrop>
        </div>
      </div>
    </div>
  );
};