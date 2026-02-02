'use client';

import { FileText, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type IThreadAttachment, formatFileSize } from '../types/attachment';

interface ServerAttachmentItemProps {
  attachment: IThreadAttachment;
  onRemove: (id: string) => void;
}

export function ServerAttachmentItem({ attachment, onRemove }: ServerAttachmentItemProps) {
  const { id, original_filename, file_size, content_type, url } = attachment;

  const isImage = content_type.startsWith('image/');

  // Truncate filename if too long
  const displayName =
    original_filename.length > 25 ? `${original_filename.slice(0, 22)}...` : original_filename;

  const handleOpenFile = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/5 p-3">
      {/* Thumbnail / Icon */}
      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- Using presigned URL from server
          <img src={url} alt={original_filename} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <FileText className="text-muted-foreground size-5" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium" title={original_filename}>
          {displayName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{formatFileSize(file_size)}</span>
          <span className="flex items-center gap-1 text-xs text-green-600">Terunggah</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleOpenFile}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Buka file"
        >
          <ExternalLink className="size-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onRemove(id)}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Hapus"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
