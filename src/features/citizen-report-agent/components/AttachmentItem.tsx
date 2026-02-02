'use client';

import {
  FileText,
  Image as ImageIcon,
  X,
  RotateCcw,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type ILocalAttachment, formatFileSize } from '../types/attachment';

interface AttachmentItemProps {
  attachment: ILocalAttachment;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export function AttachmentItem({ attachment, onRemove, onRetry }: AttachmentItemProps) {
  const { id, name, size, type, status, progress, error, previewUrl } = attachment;

  const isImage = type.startsWith('image/');
  const isPending = status === 'pending';
  const isUploading = status === 'uploading';
  const isUploaded = status === 'uploaded';
  const isError = status === 'error';

  // Truncate filename if too long
  const displayName = name.length > 25 ? `${name.slice(0, 22)}...` : name;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3',
        isError && 'border-destructive/50 bg-destructive/5',
        isUploaded && 'border-green-500/50 bg-green-500/5'
      )}
    >
      {/* Thumbnail / Icon */}
      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
        {isImage && previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Using blob URL from createObjectURL
          <img src={previewUrl} alt={name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            {isImage ? (
              <ImageIcon className="text-muted-foreground size-5" />
            ) : (
              <FileText className="text-muted-foreground size-5" />
            )}
          </div>
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center">
            <Loader2 className="text-primary size-4 animate-spin" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium" title={name}>
          {displayName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{formatFileSize(size)}</span>

          {/* Status indicator */}
          {isPending && <span className="text-muted-foreground text-xs">Menunggu...</span>}
          {isUploading && <span className="text-primary text-xs">{progress}%</span>}
          {isUploaded && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <Check className="size-3" />
              Terunggah
            </span>
          )}
          {isError && (
            <span className="text-destructive flex items-center gap-1 text-xs">
              <AlertCircle className="size-3" />
              {error || 'Gagal'}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {isUploading && (
          <div className="bg-muted mt-1 h-1 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {isError && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onRetry(id)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Coba lagi"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        )}

        {!isUploading && (
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
        )}
      </div>
    </div>
  );
}
