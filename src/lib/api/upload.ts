/**
 * File Upload Utility with Progress Tracking
 *
 * Uses XMLHttpRequest instead of fetch to support upload progress events.
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  /** Callback for upload progress */
  onProgress?: (progress: UploadProgress) => void;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

export interface UploadResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Upload a file with progress tracking
 *
 * @param url - Upload endpoint URL
 * @param file - File to upload
 * @param fieldName - Form field name for the file (default: 'file')
 * @param options - Upload options
 */
export function uploadFile<T = unknown>(
  url: string,
  file: File,
  fieldName: string = 'file',
  options: UploadOptions = {}
): Promise<UploadResult<T>> {
  const { onProgress, signal } = options;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append(fieldName, file);

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        resolve({ success: false, error: 'Upload dibatalkan' });
      });
    }

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            resolve({ success: true, data: response.data as T });
          } else {
            resolve({
              success: false,
              error: response.message || 'Gagal mengunggah file',
            });
          }
        } catch {
          resolve({ success: false, error: 'Invalid response format' });
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          resolve({
            success: false,
            error: errorResponse.message || `Upload failed with status ${xhr.status}`,
          });
        } catch {
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}`,
          });
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      resolve({ success: false, error: 'Gagal mengunggah file. Periksa koneksi internet.' });
    });

    xhr.addEventListener('abort', () => {
      resolve({ success: false, error: 'Upload dibatalkan' });
    });

    xhr.addEventListener('timeout', () => {
      resolve({ success: false, error: 'Upload timeout' });
    });

    // Open and send
    xhr.open('POST', url);
    xhr.timeout = 300000; // 5 minute timeout for large files
    xhr.send(formData);
  });
}

/**
 * Upload a file to citizen-report-agent thread attachments
 */
export function uploadThreadAttachment<T = unknown>(
  threadId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult<T>> {
  const url = `/api/proxy-upload/core/citizen-report-agent/threads/${threadId}/attachments`;
  return uploadFile<T>(url, file, 'file', options);
}

/**
 * Fetch attachments for a thread
 */
export async function fetchThreadAttachments<T = unknown>(
  threadId: string
): Promise<UploadResult<T[]>> {
  try {
    const response = await fetch(
      `/api/proxy/core/citizen-report-agent/threads/${threadId}/attachments`
    );

    if (!response.ok) {
      return { success: false, error: 'Gagal memuat lampiran' };
    }

    const result = await response.json();
    if (result.success) {
      return { success: true, data: result.data as T[] };
    }

    return { success: false, error: result.message || 'Gagal memuat lampiran' };
  } catch {
    return { success: false, error: 'Gagal memuat lampiran' };
  }
}

/**
 * Delete an attachment from a thread
 */
export async function deleteThreadAttachment(
  threadId: string,
  attachmentId: string
): Promise<UploadResult<void>> {
  try {
    const response = await fetch(
      `/api/proxy/core/citizen-report-agent/threads/${threadId}/attachments/${attachmentId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      return { success: false, error: 'Gagal menghapus lampiran' };
    }

    const result = await response.json();
    if (result.success) {
      return { success: true };
    }

    return { success: false, error: result.message || 'Gagal menghapus lampiran' };
  } catch {
    return { success: false, error: 'Gagal menghapus lampiran' };
  }
}
