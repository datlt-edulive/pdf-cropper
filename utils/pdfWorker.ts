import * as pdfjsLib from 'pdfjs-dist';

// We need to set the worker source for pdfjs-dist to work in the browser.
// Using a CDN version that matches the installed version is the standard way for client-side only apps.
export const initPdfWorker = () => {
  // Using a specific version (3.11.174) compatible with modern React setups
  // Handle potential default export wrapper from ESM CDN
  const lib = pdfjsLib as any;
  const workerOptions = lib.GlobalWorkerOptions || lib.default?.GlobalWorkerOptions;

  if (workerOptions) {
    workerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  } else {
    console.warn("Could not configure PDF.js worker: GlobalWorkerOptions not found in import");
  }
};