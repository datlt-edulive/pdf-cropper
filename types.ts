export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px';
}

export interface UploadResponse {
  success: boolean;
  message: string;
}

export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
}
