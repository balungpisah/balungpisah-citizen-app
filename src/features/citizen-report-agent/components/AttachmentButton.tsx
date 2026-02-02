'use client';

import { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ATTACHMENT_CONFIG } from '../types/attachment';

interface AttachmentButtonProps {
  /** Current number of attachments */
  count: number;
  /** Whether more files can be added */
  canAddMore: boolean;
  /** Callback when files are selected */
  onFilesSelected: (files: FileList) => void;
  /** Callback to open attachments drawer */
  onOpenDrawer: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
}

export function AttachmentButton({
  count,
  canAddMore,
  onFilesSelected,
  onOpenDrawer,
  disabled = false,
}: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (count > 0) {
      // If has attachments, open drawer to manage them
      onOpenDrawer();
    } else if (canAddMore) {
      // If no attachments, open file picker
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled || (!canAddMore && count === 0)}
        className={cn('shrink-0', count > 0 && 'text-primary')}
        aria-label={count > 0 ? `${count} lampiran` : 'Tambah lampiran'}
      >
        <Paperclip className="size-4" />
      </Button>

      {/* Badge counter */}
      {count > 0 && (
        <span className="bg-primary text-primary-foreground pointer-events-none absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
          {count}
        </span>
      )}

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
  );
}
