'use client';

import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
}

export function ChatHeader({
  title = 'Lapor Masalah',
  onBack,
  backLabel = 'Kembali',
}: ChatHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-background border-card sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <button
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary size-4" />
          <span className="text-foreground text-sm font-medium">{title}</span>
        </div>
        <div className="w-20" />
      </div>
    </header>
  );
}
