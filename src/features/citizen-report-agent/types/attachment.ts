/**
 * Attachment Types for Citizen Report Agent
 */

// ==================== Configuration ====================

export const ATTACHMENT_CONFIG = {
  /** Maximum number of files per thread */
  MAX_FILES: 5,
  /** Maximum file size in bytes (20MB) */
  MAX_SIZE: 20 * 1024 * 1024,
  /** Maximum file size in MB for display */
  MAX_SIZE_MB: 20,
  /** Allowed MIME types */
  ACCEPTED_TYPES: ['image/*', 'application/pdf'] as const,
  /** Accepted types for input element */
  ACCEPT_STRING: 'image/*,application/pdf',
} as const;

// ==================== Upload Status ====================

export type AttachmentStatus = 'pending' | 'uploading' | 'uploaded' | 'error';

// ==================== Local Attachment ====================

/**
 * Attachment stored locally before upload
 */
export interface ILocalAttachment {
  /** Unique local ID */
  id: string;
  /** Original file object */
  file: File;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Current status */
  status: AttachmentStatus;
  /** Upload progress (0-100) */
  progress: number;
  /** Error message if status is 'error' */
  error?: string;
  /** Server attachment ID after upload */
  serverId?: string;
  /** Object URL for preview (images only) */
  previewUrl?: string;
}

// ==================== Thread Attachment ====================

/**
 * Attachment response from server (matches IThreadAttachmentResponseDto)
 */
export interface IThreadAttachment {
  /** Unique identifier for the attachment */
  id: string;
  /** Thread ID this attachment belongs to */
  thread_id: string;
  /** File ID reference */
  file_id: string;
  /** Original filename */
  original_filename: string;
  /** MIME type of the file */
  content_type: string;
  /** Size of the file in bytes */
  file_size: number;
  /** URL to access the file (presigned URL for private files) */
  url: string;
  /** Timestamp when the attachment was created */
  created_at: string;
}

// ==================== Validation ====================

export interface AttachmentValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a single file
 */
export function validateAttachment(file: File): AttachmentValidationResult {
  // Check file size
  if (file.size > ATTACHMENT_CONFIG.MAX_SIZE) {
    return {
      valid: false,
      error: `Ukuran file maksimal ${ATTACHMENT_CONFIG.MAX_SIZE_MB}MB`,
    };
  }

  // Check file type
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  if (!isImage && !isPdf) {
    return {
      valid: false,
      error: 'Hanya gambar dan PDF yang diizinkan',
    };
  }

  return { valid: true };
}

/**
 * Validate adding files to existing attachments
 */
export function validateAttachmentCount(
  currentCount: number,
  newFilesCount: number
): AttachmentValidationResult {
  const totalCount = currentCount + newFilesCount;

  if (totalCount > ATTACHMENT_CONFIG.MAX_FILES) {
    return {
      valid: false,
      error: `Maksimal ${ATTACHMENT_CONFIG.MAX_FILES} lampiran`,
    };
  }

  return { valid: true };
}

// ==================== Helpers ====================

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * Create a local attachment from a File
 */
export function createLocalAttachment(file: File): ILocalAttachment {
  const isImage = file.type.startsWith('image/');

  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'pending',
    progress: 0,
    previewUrl: isImage ? URL.createObjectURL(file) : undefined,
  };
}

/**
 * Cleanup preview URLs to prevent memory leaks
 */
export function revokePreviewUrl(attachment: ILocalAttachment): void {
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
}
