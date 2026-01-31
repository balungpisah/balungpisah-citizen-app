import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/features/contribution/components/ShareButton';

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Pendaftaran Berhasil - BalungPisah',
  description:
    'Terima kasih sudah bergabung dengan gerakan Urun Rembug BalungPisah. Sinyalmu sudah kami terima.',
  openGraph: {
    title: 'Pendaftaran Berhasil - BalungPisah',
    description:
      'Terima kasih sudah bergabung dengan gerakan Urun Rembug BalungPisah. Sinyalmu sudah kami terima.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'BalungPisah',
  },
  twitter: {
    card: 'summary',
    title: 'Pendaftaran Berhasil - BalungPisah',
    description:
      'Terima kasih sudah bergabung dengan gerakan Urun Rembug BalungPisah. Sinyalmu sudah kami terima.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

// ============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// ============================================================================

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function ContributionSuccessPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  const isOrganization = type === 'organization';

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Success Card */}
        <div className="bg-card border-border rounded-2xl border p-8 text-center sm:p-10">
          {/* Success Icon */}
          <div className="bg-success/15 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <CheckCircle2 size={48} className="text-success" />
          </div>

          {/* Title */}
          <h1 className="text-foreground mb-3 text-2xl font-bold sm:text-3xl">
            {isOrganization ? 'Pendaftaran Diterima!' : 'Sinyalmu Sampai!'}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-8 text-base leading-relaxed">
            {isOrganization
              ? 'Terima kasih atas minat kolaborasi dari rombonganmu. Tim kami akan segera menghubungi narahubung untuk diskusi lebih lanjut.'
              : 'Terima kasih sudah mau ikut tandang gawe. Sinyalmu sudah kami simpan baik-baik.'}
          </p>

          {/* Next Steps */}
          <div className="bg-background border-border mb-8 rounded-xl border p-5 text-left">
            <h2 className="text-primary mb-4 text-sm font-semibold tracking-wide uppercase">
              Selanjutnya
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  1
                </span>
                <span className="text-foreground text-sm leading-relaxed">
                  {isOrganization
                    ? 'Rombonganmu sudah tercatat sebagai mitra potensial gerakan ini. Tim kami akan menghubungi narahubung untuk diskusi lebih lanjut.'
                    : 'Kamu sudah resmi tercatat sebagai bagian dari gerakan Urun Rembug. Terima kasih sudah mau ikut andil.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  2
                </span>
                <span className="text-foreground text-sm leading-relaxed">
                  {isOrganization
                    ? 'Informasi perkembangan kolaborasi akan kami sampaikan via email dan WhatsApp.'
                    : 'Informasi komunitas dan perkembangan selanjutnya akan kami kirim via WhatsApp. Pastikan nomormu aktif.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/20 text-primary flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  3
                </span>
                <span className="text-foreground text-sm leading-relaxed">
                  {isOrganization
                    ? 'Sambil menunggu, bantu sebarkan gerakan ini ke jaringan rombonganmu.'
                    : 'Sambil menunggu, bantu sebarkan gerakan ini ke jaringanmu. Semakin ramai, semakin kuat.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <ShareButton isOrganization={isOrganization} />

            <Link href="/" className="block">
              <Button variant="ghost" className="text-muted-foreground w-full py-5">
                <Home size={18} className="mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>

        {/* Quote */}
        <div className="bg-primary/5 border-primary/20 mt-6 rounded-xl border p-5 text-center">
          <p className="text-foreground text-sm leading-relaxed italic">
            &quot;Nggak ada mandor, nggak ada kuli. Kita isi meja ini sampai penuh dengan keahlian
            masing-masing.&quot;
          </p>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground mt-8 text-center text-xs">&copy; 2026 BalungPisah.id</p>
      </div>
    </div>
  );
}
