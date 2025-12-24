import React, { useState } from 'react';
import { Button } from './Button';
import { uploadImageToBackend, createFolder } from '../services/uploadService';

interface SidebarProps {
  previewUrl: string | null;
  previewBlob: Blob | null;
  onClear: () => void;
  width: number;
}

const URL_BASE = "https://thuvien.aiteacher.vn";

export const Sidebar: React.FC<SidebarProps> = ({ previewUrl, previewBlob, onClear, width }) => {
  const [imageName, setImageName] = useState('');
  const [uploadPath, setUploadPath] = useState('data-ai/images/class_1/toan/sgk/ketnoitrithuc/tap1/');
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{success: boolean, text: string} | null>(null);

  // Folder Creation State
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderResult, setFolderResult] = useState<{success: boolean, text: string} | null>(null);

  const handleUpload = async () => {
    if (!previewBlob || !imageName.trim() || !uploadPath.trim()) return;

    setIsUploading(true);
    setUploadResult(null);
    setFolderResult(null);

    const fullUrl = `${URL_BASE}/${uploadPath}`;

    try {
      const responseText = await uploadImageToBackend(previewBlob, imageName, fullUrl);
      setUploadResult({ success: true, text: responseText || "Upload Successful!" });
    } catch (err: any) {
      setUploadResult({ success: false, text: err.message || "Upload Failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!uploadPath.trim()) return;

    setIsCreatingFolder(true);
    setFolderResult(null);
    setUploadResult(null);

    const fullUrl = `${URL_BASE}/${uploadPath}`;

    try {
      const responseText = await createFolder(fullUrl);
      setFolderResult({ success: true, text: responseText || "Folder Created Successfully!" });
    } catch (err: any) {
      setFolderResult({ success: false, text: err.message || "Folder Creation Failed" });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  if (!previewUrl) {
    return (
      <div 
        style={{ width }}
        className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center border-l border-slate-200 bg-white flex-shrink-0"
      >
        <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <p className="text-sm">Select an area on the PDF and click "Capture Selection" to preview it here.</p>
      </div>
    );
  }

  return (
    <div 
      style={{ width }}
      className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl z-20 flex-shrink-0"
    >
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Preview & Upload</h2>
        <button onClick={onClear} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear</button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-slate-100 rounded-lg p-2 mb-6 border border-slate-200 flex items-center justify-center min-h-[150px]">
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded shadow-sm object-contain" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Image Name</label>
            <input 
              type="text" 
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="e.g. page_0001_box_001"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Base URL</label>
             <div className="text-xs text-slate-400 mb-1">{URL_BASE}/</div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">URL Path</label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                /
              </span>
              <input 
                type="text" 
                value={uploadPath}
                onChange={(e) => setUploadPath(e.target.value)}
                placeholder="api/upload"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            
            <div className="flex justify-between items-start mt-2">
               <p className="text-xs text-slate-400 break-all flex-1 mr-2">
                 Target: {`${URL_BASE}/${uploadPath}`}
               </p>
               <Button 
                 variant="secondary" 
                 onClick={handleCreateFolder}
                 isLoading={isCreatingFolder}
                 disabled={!uploadPath}
                 className="text-xs py-1 px-2 h-7 whitespace-nowrap"
                 title="Create an empty folder at this path"
               >
                 Create Folder
               </Button>
            </div>
            
            {folderResult && (
              <div className={`mt-2 p-2 rounded text-xs ${folderResult.success ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <p className="font-bold">{folderResult.success ? 'Folder Created' : 'Folder Error'}</p>
                <p className="mt-0.5 break-all font-mono opacity-80">{folderResult.text}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Button 
              className="w-full" 
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={!imageName || !uploadPath}
            >
              Upload Image
            </Button>
          </div>

          {uploadResult && (
            <div className={`mt-4 p-3 rounded text-sm ${uploadResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <p className="font-bold">{uploadResult.success ? 'Success' : 'Error'}</p>
              <p className="text-xs mt-1 break-all font-mono">{uploadResult.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};