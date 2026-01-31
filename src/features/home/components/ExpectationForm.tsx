'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useMutation } from '@/hooks/api/use-mutation';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

interface ICreateExpectationDto {
  email?: string | null;
  expectation: string;
  name?: string | null;
}

interface IExpectationResponseDto {
  createdAt: string;
  email?: string | null;
  expectation: string;
  id: string;
  name?: string | null;
}

// ============================================================================
// EXPECTATION FORM COMPONENT
// ============================================================================

export function ExpectationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expectation: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: createExpectation, isPending: isSubmitting } = useMutation<
    IExpectationResponseDto,
    ICreateExpectationDto
  >({
    resource: 'expectations',
    onSuccess: () => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', expectation: '' });
      toast.success('Harapanmu berhasil dikirim!');
    },
    onError: (error) => {
      console.error('Failed to submit expectation:', error);
      toast.error('Gagal mengirim harapan. Silakan coba lagi.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.expectation.trim()) return;

    createExpectation({
      expectation: formData.expectation.trim(),
      name: formData.name.trim() || null,
      email: formData.email.trim() || null,
    });
  };

  return (
    <div className="bg-background border-border rounded-2xl border p-6 sm:p-8">
      {isSubmitted ? (
        <div className="py-8 text-center">
          <div className="bg-success/20 text-success mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-foreground mb-2 text-xl font-semibold">Terima Kasih!</h3>
          <p className="text-muted-foreground mb-6">Harapanmu sudah kami terima.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="border-primary text-primary hover:bg-primary/10 rounded-lg border bg-transparent px-6 py-2 font-medium transition-colors"
          >
            Kirim Harapan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Nama <span className="text-muted-foreground">(opsional)</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama kamu"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-muted text-foreground border-border focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Email <span className="text-muted-foreground">(opsional)</span>
            </label>
            <input
              type="email"
              placeholder="Untuk mendapat kabar terbaru"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-muted text-foreground border-border focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          {/* Expectation Field */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Harapanmu <span className="text-primary">*</span>
            </label>
            <textarea
              placeholder="Ceritakan apa yang kamu harapkan dari platform ini..."
              value={formData.expectation}
              onChange={(e) => setFormData({ ...formData, expectation: e.target.value })}
              rows={5}
              required
              className="bg-muted text-foreground border-border focus:border-primary focus:ring-primary/20 w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.expectation.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={20} />
                Kirim Harapan
              </>
            )}
          </button>

          <p className="text-muted-foreground text-center text-sm">
            Data akan digunakan untuk mengembangkan platform.
          </p>
        </form>
      )}
    </div>
  );
}
