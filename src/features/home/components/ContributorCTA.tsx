'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// ============================================================================
// CONSTANTS
// ============================================================================

const CONTRIBUTOR_ROLES = [
  {
    icon: '💻',
    title: 'Urun Kode & Logika',
    description:
      'Developer & Ahli IT. Mari membangun sistem yang waras. Pastikan logika digital kita tak bisa dibengkokkan.',
  },
  {
    icon: '🎙️',
    title: 'Urun Panggung & Suara',
    description:
      'Podcaster, Media & Aktivis Sosmed. Pinjamkan panggungmu. Jadilah penjernih di tengah riuhnya pasar opini.',
  },
  {
    icon: '⚖️',
    title: 'Urun Tatanan & Aturan',
    description:
      'Ahli Hukum & Riset. Bantu kami memasang pagar aturan. Biar niat baik ini tidak dijegal di tengah jalan.',
  },
  {
    icon: '👁️',
    title: 'Urun Mata & Telinga',
    description:
      'Warga & Saksi. Jadilah mata di lapangan. Kabarkan kenyataan apa anane, bukan hasil polesan.',
  },
];

// ============================================================================
// CONTRIBUTOR CTA COMPONENT
// ============================================================================

export function ContributorCTA() {
  return (
    <section id="urun-rembug" className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="bg-primary/15 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            Urun Rembug
          </div>
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Mari Urun Rembug.</h2>
          <p className="text-foreground mx-auto mb-2 max-w-2xl text-lg leading-relaxed">
            Ini bukan panggung satu orang. Ini meja kita bersama.
          </p>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed">
            Nggak ada mandor, nggak ada kuli. Kita isi meja ini sampai penuh dengan keahlian
            masing-masing.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTRIBUTOR_ROLES.map((role) => (
            <div
              key={role.title}
              className="bg-card border-border flex flex-col rounded-xl border p-6 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="mb-4 text-4xl">{role.icon}</div>
              <h3 className="text-foreground mb-3 text-base leading-tight font-semibold">
                {role.title}
              </h3>
              <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/contribution"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-10 py-4 text-lg font-bold transition-all duration-200 hover:scale-[1.02]"
          >
            SIAP TANDANG GAWE!
            <ArrowRight size={20} />
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">Mari urun rembug bareng</p>
        </div>
      </div>
    </section>
  );
}
