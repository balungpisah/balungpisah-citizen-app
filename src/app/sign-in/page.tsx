'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  useEffect(() => {
    window.location.href = '/api/auth/sign-in';
  }, []);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Mengalihkan ke halaman masuk...</p>
      </div>
    </div>
  );
}
