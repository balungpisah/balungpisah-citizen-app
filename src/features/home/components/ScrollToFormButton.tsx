'use client';

import { Button } from '@/components/ui/button';

interface ScrollToFormButtonProps {
  targetId: string;
}

export function ScrollToFormButton({ targetId }: ScrollToFormButtonProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 rounded-full px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105"
    >
      IKUT TANDANG GAWE!
    </Button>
  );
}
