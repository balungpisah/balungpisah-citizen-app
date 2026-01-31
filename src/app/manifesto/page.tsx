import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/features/home/components/Navbar';

export const metadata: Metadata = {
  title: 'Manifesto - BalungPisah',
  description:
    'Manifesto Balungpisah: Gotong Royong 2.0 untuk menyambung kembali yang terpisah. Sepuluh prinsip yang menjadi landasan gerakan kami.',
};

const manifestoSections = [
  {
    number: '01',
    title: 'Indonesia: Arus yang Sedang Tersumbat',
    content: `Masalah kita bukan karena rumah ini buruk. Masalahnya, arus niat baik kita sedang tersumbat. Kita punya jutaan orang baik, tapi energinya habis saling beradu, sementara di banyak titik, denyut nadi pembangunan kita berhenti karena Sekat Informasi. Balungpisah hadir untuk menyambung kembali tulang-tulang yang terpisah agar arus kebaikan ini mengalir lagi.`,
  },
  {
    number: '02',
    title: 'Musuh Kita: Sekat yang Memisahkan',
    content: `Musuh kita bukan orang, bukan kelompok. Musuh kita adalah Sekat: yang memisahkan antara laporan dan kenyataan, antara niat dan aksi, antara rakyat dan pembuat kebijakan. Kami berhenti mencari siapa yang salah, dan mulai fokus pada apa yang tersumbat. Lalu kita bersihkan bersama.`,
  },
  {
    number: '03',
    title: 'Gotong Royong: Nyawa yang Harus Kembali',
    content: `Nenek moyang kita tidak butuh instruksi untuk membantu tetangga. Itu adalah DNA kita. Balungpisah adalah Gotong Royong 2.0. Di era digital, kepedulianmu tidak boleh hanya berhenti di jempol. Masalah terdeteksi, solusi diverifikasi, aksi dieksekusi. Kita kembalikan martabat bangsa ini lewat tandang yang nyata.`,
  },
  {
    number: '04',
    title: 'Harkat Berdasar Karya',
    content: `Kami tidak tanya siapa bapakmu. Kami tidak tanya siapa koneksimu. Kami hanya tanya: Apa yang sanggup kamu kerjakan?

    Balungpisah adalah panggung bagi mereka yang selama ini "tidak terlihat." Di sini, rekam jejakmu adalah modal yang jauh lebih berharga daripada "orang dalam."`,
  },
  {
    number: '05',
    title: 'Jejak Tandang: Ijazah dari Kehidupan',
    content: `Setiap masalah yang kamu bantu urus akan tercatat dalam 'Jejak Tandang'. Ini adalah bukti abadi tentang kapasitasmu. Bagi kamu yang selama ini terpinggirkan, jejak ini adalah sertifikat kedaulatanmu. Kami tidak menjanjikan lowongan kerja, tapi kami menjanjikan Visibilitas: sistem ini akan membuat karyamu mustahil untuk diabaikan oleh siapa pun.`,
  },
  {
    number: '06',
    title: 'Dari Marah Menjadi Maslahat',
    content: `Selama ini hanya bisa mengkritik? Kami paham rasa sakitmu. Kritik adalah tanda cintamu yang terluka. Tapi di Balungpisah, kami mengajakmu meng-upgrade kemarahan menjadi tenaga untuk memperbaiki. Berhenti hanya mendiagnosa penyakit; mari kita mulai tandang meracik obatnya bersama-sama.`,
  },
  {
    number: '07',
    title: 'Harapan yang Terukur',
    content: `Kita tidak sedang bermimpi tentang surga dalam semalam. Kita sedang melakukan Uji Jernih. Satu sumbatan dibuka, satu kepercayaan tumbuh. Satu layanan diperbaiki, satu harapan pulih. Indonesia yang lebih baik dibangun dari ribuan keberhasilan kecil yang tercatat setiap hari.`,
  },
  {
    number: '08',
    title: 'Langkah Tandang',
    content: `Deteksi: Jadi mata bagi lingkunganmu. Laporkan fakta, bukan rumor.

Validasi: Jadi otak bagi bangsamu. Pastikan data jernih sebelum bergerak.

Eksekusi: Jadi tangan bagi saudaramu. Klaim peran, berikan solusi.

Rekam Karya: Biarkan kerjamu bicara. Jejakmu adalah martabatmu.`,
  },
  {
    number: '09',
    title: 'Janji Kami kepada Ibu Pertiwi',
    content: `Jernih: Semua data terbuka, tanpa manipulasi.

Adil: Pengakuan hanya diberikan kepada mereka yang benar-benar bekerja.

Tangguh: Sistem ini milik kita semua. Ia akan tetap hidup, siapapun nakhodanya, jika kita menjaganya bersama.`,
  },
  {
    number: '10',
    title: 'Penutup',
    content: `Indonesia adalah kapal besar yang sedang mencari arah. Balungpisah bukan nakhodanya, bukan pula pemilik kapalnya. Balungpisah adalah sensor navigasi yang memastikan kapal ini tidak menabrak karang kesia-siaan.`,
  },
];

export default function ManifestoPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        {/* Gradient orbs background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/20 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
          <div className="bg-primary/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-primary mb-4 text-sm font-medium tracking-widest uppercase">
            Prinsip & Nilai
          </p>
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Manifesto <span className="text-primary">Balungpisah</span>
          </h1>
        </div>
      </section>

      {/* Manifesto Sections */}
      <div className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {manifestoSections.map((section) => (
            <section
              key={section.number}
              className="border-border/50 relative border-b py-16 last:border-b-0"
            >
              {/* Background number */}
              <span className="text-primary/10 pointer-events-none absolute -top-4 left-0 text-8xl font-bold select-none sm:text-9xl">
                {section.number}
              </span>

              <div className="relative">
                <h2 className="text-foreground mb-6 text-2xl font-semibold sm:text-3xl">
                  {section.title}
                </h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                    // Check if paragraph starts with a label pattern like "Deteksi:" or "Rekam Karya:"
                    const labelMatch = paragraph.match(/^([A-Za-z\s]+):\s/);
                    if (labelMatch) {
                      const label = labelMatch[1];
                      const rest = paragraph.slice(labelMatch[0].length);
                      return (
                        <p key={pIndex}>
                          <strong className="text-foreground">{label}:</strong> {rest}
                        </p>
                      );
                    }
                    return <p key={pIndex}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <section className="border-border/50 border-t px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground mb-8 text-xl leading-relaxed italic">
            &ldquo;Satu masalah. Satu solusi. Satu langkah kolektif. Mari Tandang Bersama.&rdquo;
          </p>
          <Link
            href="/contribution"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3 font-medium transition-colors"
          >
            Mari Tandang Bersama
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
