'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  isOrganization: boolean;
}

export function ShareButton({ isOrganization }: ShareButtonProps) {
  const handleShare = async () => {
    const shareText = isOrganization
      ? 'Organisasi kami sudah bergabung dengan gerakan Urun Rembug di BalungPisah.id! Mari berkolaborasi untuk Indonesia yang lebih baik.'
      : 'Aku sudah daftar jadi bagian dari gerakan Urun Rembug di BalungPisah.id! Yuk ikut tandang gawe bareng.';
    const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/contribution' : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Urun Rembug - BalungPisah',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error - do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success('Link berhasil disalin!');
      } catch {
        toast.error('Gagal menyalin link');
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-5"
    >
      <Share2 size={18} className="mr-2" />
      Sebarkan ke Temanmu
    </Button>
  );
}
