import { PixelCrop } from '../types';

/**
 * Extracts a cropped image from a source canvas (or image) and returns it as a Blob.
 */
export const getCroppedImg = (
  image: HTMLImageElement | HTMLCanvasElement,
  crop: PixelCrop,
  fileName: string
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  
  // Use natural size for images to get full resolution crop, otherwise assume 1:1 for canvas
  let scaleX = 1;
  let scaleY = 1;

  if (image instanceof HTMLImageElement) {
    scaleX = image.naturalWidth / image.width;
    scaleY = image.naturalHeight / image.height;
  }
  
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Draw the cropped image onto the new canvas
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      // Assign a name to the blob for file handling
      (blob as any).name = fileName;
      resolve(blob);
    }, 'image/png');
  });
};