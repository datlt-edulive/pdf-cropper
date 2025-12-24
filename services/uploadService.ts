/**
 * Uploads an image file to the specified URL.
 * 
 * Equivalent to Python logic:
 * files=[('file',(file_path,open(file_path,'rb'),f'image/{extension}'))]
 * requests.request("POST", url, headers=headers, data=payload, files=files)
 */
export const uploadImageToBackend = async (
  imageBlob: Blob,
  fileName: string,
  targetUrl: string
): Promise<string> => {
  const formData = new FormData();
  
  // Ensure extension exists
  let finalFileName = fileName;
  if (!finalFileName.toLowerCase().endsWith('.png')) {
      finalFileName += '.png';
  }

  // 'file' is the key expected by the Python backend example provided
  formData.append('file', imageBlob, finalFileName);

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
      // Note: Do not set 'Content-Type': 'multipart/form-data' manually.
      // The browser sets it automatically with the correct boundary when using FormData.
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

/**
 * Creates an empty folder at the specified URL path.
 * 
 * Equivalent to Python logic:
 * url = f"{URL_BASE}/{url_path}"
 * response = requests.request("POST", url)
 */
export const createFolder = async (targetUrl: string): Promise<string> => {
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Folder creation failed:', error);
    throw error;
  }
};