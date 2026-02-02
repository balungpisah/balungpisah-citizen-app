'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useChatStore } from '../stores/chat-store';
import {
  ATTACHMENT_CONFIG,
  validateAttachment,
  validateAttachmentCount,
  createLocalAttachment,
  type ILocalAttachment,
  type IThreadAttachment,
} from '../types/attachment';
import {
  uploadThreadAttachment,
  fetchThreadAttachments,
  deleteThreadAttachment,
} from '@/lib/api/upload';

interface UseAttachmentsOptions {
  /** Callback when all pending uploads complete */
  onUploadsComplete?: () => void;
}

export function useAttachments(options: UseAttachmentsOptions = {}) {
  const { onUploadsComplete } = options;
  const uploadingRef = useRef(false);
  const loadedThreadIdRef = useRef<string | null>(null);

  // Store selectors
  const localAttachments = useChatStore((state) => state.localAttachments);
  const serverAttachments = useChatStore((state) => state.serverAttachments);
  const isLoadingAttachments = useChatStore((state) => state.isLoadingAttachments);
  const isDrawerOpen = useChatStore((state) => state.isDrawerOpen);
  const threadId = useChatStore((state) => state.threadId);

  // Store actions
  const addLocalAttachments = useChatStore((state) => state.addLocalAttachments);
  const removeLocalAttachment = useChatStore((state) => state.removeLocalAttachment);
  const updateLocalAttachment = useChatStore((state) => state.updateLocalAttachment);
  const clearLocalAttachments = useChatStore((state) => state.clearLocalAttachments);
  const setServerAttachments = useChatStore((state) => state.setServerAttachments);
  const removeServerAttachment = useChatStore((state) => state.removeServerAttachment);
  const setLoadingAttachments = useChatStore((state) => state.setLoadingAttachments);
  const setDrawerOpen = useChatStore((state) => state.setDrawerOpen);

  /**
   * Load server attachments for a thread
   */
  const loadServerAttachments = useCallback(
    async (tid: string) => {
      setLoadingAttachments(true);
      try {
        const result = await fetchThreadAttachments<IThreadAttachment>(tid);
        if (result.success && result.data) {
          setServerAttachments(result.data);
        } else {
          setServerAttachments([]);
        }
      } catch {
        setServerAttachments([]);
      } finally {
        setLoadingAttachments(false);
      }
    },
    [setLoadingAttachments, setServerAttachments]
  );

  // Load server attachments when threadId changes
  useEffect(() => {
    if (threadId && threadId !== loadedThreadIdRef.current) {
      loadedThreadIdRef.current = threadId;
      loadServerAttachments(threadId);
    } else if (!threadId) {
      loadedThreadIdRef.current = null;
      setServerAttachments([]);
    }
  }, [threadId, loadServerAttachments, setServerAttachments]);

  /**
   * Upload all pending attachments to the thread
   */
  const uploadPendingAttachments = useCallback(
    async (targetThreadId: string) => {
      // Prevent concurrent upload sessions
      if (uploadingRef.current) return;

      const currentAttachments = useChatStore.getState().localAttachments;
      const pendingAttachments = currentAttachments.filter((a) => a.status === 'pending');

      if (pendingAttachments.length === 0) return;

      uploadingRef.current = true;

      try {
        // Upload one by one to show individual progress
        for (const attachment of pendingAttachments) {
          // Check if attachment still exists (might have been removed)
          const stillExists = useChatStore
            .getState()
            .localAttachments.some((a) => a.id === attachment.id);
          if (!stillExists) continue;

          // Update status to uploading
          updateLocalAttachment(attachment.id, { status: 'uploading', progress: 0 });

          const result = await uploadThreadAttachment<IThreadAttachment>(
            targetThreadId,
            attachment.file,
            {
              onProgress: (progress) => {
                updateLocalAttachment(attachment.id, { progress: progress.percentage });
              },
            }
          );

          if (result.success && result.data) {
            updateLocalAttachment(attachment.id, {
              status: 'uploaded',
              progress: 100,
              serverId: result.data.id,
            });

            // Add to server attachments immediately
            const currentServerAttachments = useChatStore.getState().serverAttachments;
            setServerAttachments([...currentServerAttachments, result.data]);
          } else {
            updateLocalAttachment(attachment.id, {
              status: 'error',
              error: result.error || 'Gagal mengunggah file',
            });
          }
        }

        onUploadsComplete?.();
      } finally {
        uploadingRef.current = false;
      }
    },
    [updateLocalAttachment, setServerAttachments, onUploadsComplete]
  );

  /**
   * Add files from input element
   */
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const currentLocalAttachments = useChatStore.getState().localAttachments;
      const currentServerAttachments = useChatStore.getState().serverAttachments;
      const currentThreadId = useChatStore.getState().threadId;

      // Count total attachments (server + local non-error)
      const existingCount =
        currentServerAttachments.length +
        currentLocalAttachments.filter((a) => a.status !== 'error').length;

      // Validate total count
      const countValidation = validateAttachmentCount(existingCount, fileArray.length);
      if (!countValidation.valid) {
        toast.error(countValidation.error);
        return;
      }

      const validAttachments: ILocalAttachment[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        const validation = validateAttachment(file);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
        } else {
          validAttachments.push(createLocalAttachment(file));
        }
      }

      // Show first error if any
      if (errors.length > 0) {
        toast.error(errors[0]);
      }

      // Add valid attachments
      if (validAttachments.length > 0) {
        addLocalAttachments(validAttachments);

        // If thread exists, start uploading immediately
        if (currentThreadId) {
          // Use setTimeout to allow state to update first
          setTimeout(() => {
            uploadPendingAttachments(currentThreadId);
          }, 0);
        }
      }
    },
    [addLocalAttachments, uploadPendingAttachments]
  );

  /**
   * Remove a local attachment
   */
  const removeLocalFile = useCallback(
    (id: string) => {
      removeLocalAttachment(id);
    },
    [removeLocalAttachment]
  );

  /**
   * Remove a server attachment
   */
  const removeServerFile = useCallback(
    async (id: string) => {
      const currentThreadId = useChatStore.getState().threadId;
      if (!currentThreadId) return;

      // Optimistically remove from UI
      removeServerAttachment(id);

      // Delete from server
      const result = await deleteThreadAttachment(currentThreadId, id);
      if (!result.success) {
        toast.error(result.error || 'Gagal menghapus lampiran');
        // Reload attachments to restore state
        loadServerAttachments(currentThreadId);
      }
    },
    [removeServerAttachment, loadServerAttachments]
  );

  /**
   * Retry uploading a failed attachment
   */
  const retryUpload = useCallback(
    (id: string) => {
      const currentThreadId = useChatStore.getState().threadId;
      if (!currentThreadId) {
        toast.error('Thread belum terbuat');
        return;
      }

      const currentAttachments = useChatStore.getState().localAttachments;
      const attachment = currentAttachments.find((a) => a.id === id);
      if (!attachment || attachment.status !== 'error') return;

      // Reset to pending then upload
      updateLocalAttachment(id, { status: 'pending', progress: 0, error: undefined });

      // Small delay to let state update
      setTimeout(() => {
        uploadPendingAttachments(currentThreadId);
      }, 0);
    },
    [updateLocalAttachment, uploadPendingAttachments]
  );

  // Computed values
  const pendingCount = localAttachments.filter((a) => a.status === 'pending').length;
  const uploadingCount = localAttachments.filter((a) => a.status === 'uploading').length;
  const uploadedLocalCount = localAttachments.filter((a) => a.status === 'uploaded').length;
  const errorCount = localAttachments.filter((a) => a.status === 'error').length;
  const serverCount = serverAttachments.length;

  // Total uploaded = server attachments (excluding ones we just uploaded that are also in local)
  const uploadedServerIds = new Set(
    localAttachments.filter((a) => a.serverId).map((a) => a.serverId)
  );
  const uniqueServerCount = serverAttachments.filter((a) => !uploadedServerIds.has(a.id)).length;
  const totalUploadedCount = uploadedLocalCount + uniqueServerCount;

  // Total count for validation (server + local non-error)
  const totalCount = serverCount + localAttachments.filter((a) => a.status !== 'error').length;
  const canAddMore = totalCount < ATTACHMENT_CONFIG.MAX_FILES;
  const hasAttachments = serverCount > 0 || localAttachments.length > 0;
  const isUploading = uploadingCount > 0;

  return {
    // State
    localAttachments,
    serverAttachments,
    isLoadingAttachments,
    isDrawerOpen,
    setDrawerOpen,

    // Actions
    addFiles,
    removeLocalFile,
    removeServerFile,
    uploadPendingAttachments,
    retryUpload,
    clearLocalAttachments,
    loadServerAttachments,

    // Computed
    pendingCount,
    uploadingCount,
    uploadedCount: totalUploadedCount,
    errorCount,
    serverCount,
    totalCount,
    canAddMore,
    hasAttachments,
    isUploading,

    // Config
    maxFiles: ATTACHMENT_CONFIG.MAX_FILES,
    acceptString: ATTACHMENT_CONFIG.ACCEPT_STRING,
  };
}
