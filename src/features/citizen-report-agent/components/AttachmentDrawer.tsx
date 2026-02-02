'use client';

import { useRef } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { AttachmentItem } from './AttachmentItem';
import { ServerAttachmentItem } from './ServerAttachmentItem';
import {
  type ILocalAttachment,
  type IThreadAttachment,
  ATTACHMENT_CONFIG,
} from '../types/attachment';

interface AttachmentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  localAttachments: ILocalAttachment[];
  serverAttachments: IThreadAttachment[];
  isLoading?: boolean;
  onFilesSelected: (files: FileList) => void;
  onRemoveLocal: (id: string) => void;
  onRemoveServer: (id: string) => void;
  onRetry: (id: string) => void;
  canAddMore: boolean;
}

export function AttachmentDrawer({
  open,
  onOpenChange,
  localAttachments,
  serverAttachments,
  isLoading = false,
  onFilesSelected,
  onRemoveLocal,
  onRemoveServer,
  onRetry,
  canAddMore,
}: AttachmentDrawerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  };

  // Filter out local attachments that have been uploaded (already in server list)
  const uploadedServerIds = new Set(serverAttachments.map((a) => a.id));
  const localOnlyAttachments = localAttachments.filter(
    (a) => !a.serverId || !uploadedServerIds.has(a.serverId)
  );

  const totalCount = serverAttachments.length + localOnlyAttachments.length;
  const uploadedCount = serverAttachments.length;
  const pendingCount = localOnlyAttachments.filter(
    (a) => a.status === 'pending' || a.status === 'uploading'
  ).length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Lampiran</DrawerTitle>
            <DrawerDescription>
              {totalCount} dari {ATTACHMENT_CONFIG.MAX_FILES} file
              {uploadedCount > 0 && ` (${uploadedCount} terunggah)`}
              {pendingCount > 0 && ` (${pendingCount} menunggu)`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-3 px-4 pb-6">
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="text-muted-foreground size-5 animate-spin" />
                <span className="text-muted-foreground ml-2 text-sm">Memuat lampiran...</span>
              </div>
            )}

            {/* Attachment list */}
            {!isLoading && (serverAttachments.length > 0 || localOnlyAttachments.length > 0) ? (
              <div className="flex flex-col gap-2">
                {/* Server attachments first */}
                {serverAttachments.map((attachment) => (
                  <ServerAttachmentItem
                    key={attachment.id}
                    attachment={attachment}
                    onRemove={onRemoveServer}
                  />
                ))}

                {/* Local attachments (pending/uploading/error only) */}
                {localOnlyAttachments.map((attachment) => (
                  <AttachmentItem
                    key={attachment.id}
                    attachment={attachment}
                    onRemove={onRemoveLocal}
                    onRetry={onRetry}
                  />
                ))}
              </div>
            ) : !isLoading ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Belum ada lampiran
              </div>
            ) : null}

            {/* Add more button */}
            {canAddMore && (
              <Button type="button" variant="outline" onClick={handleAddClick} className="w-full">
                <Plus className="size-4" />
                Tambah Lampiran
              </Button>
            )}

            {/* Info text */}
            <p className="text-muted-foreground text-center text-xs">
              Maksimal {ATTACHMENT_CONFIG.MAX_FILES} file, {ATTACHMENT_CONFIG.MAX_SIZE_MB}MB per
              file
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept={ATTACHMENT_CONFIG.ACCEPT_STRING}
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
