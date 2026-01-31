'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface LogtoContext {
  isAuthenticated: boolean;
}

export default function AuthProcessingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processAuth() {
      try {
        // Fetch user context to get auth state
        const response = await fetch('/api/context');

        if (!response.ok) {
          throw new Error('Gagal mengambil informasi pengguna');
        }

        const context: LogtoContext = await response.json();

        // Check if user is authenticated
        if (!context.isAuthenticated) {
          router.replace('/sign-in');
          return;
        }

        // Redirect to home page
        router.replace('/');
      } catch (err) {
        console.error('Error processing auth:', err);
        setError('Terjadi kesalahan saat memproses autentikasi');

        // Redirect to sign-in after 2 seconds
        setTimeout(() => {
          router.replace('/sign-in');
        }, 2000);
      }
    }

    processAuth();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">{error}</p>
          <p className="text-muted-foreground text-sm">Mengalihkan ke halaman masuk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
        <p className="text-muted-foreground mt-4">Memproses autentikasi...</p>
      </div>
    </div>
  );
}
