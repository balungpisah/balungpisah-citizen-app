import { z } from 'zod';

export const personalSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  whatsapp: z
    .string()
    .min(1, 'No. WhatsApp wajib diisi')
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, 'Format nomor tidak valid'),
  city: z.string().min(2, 'Domisili wajib diisi'),
  role: z
    .enum(['perakit', 'penyuara', 'perumus', 'saksi_fakta', 'lainnya'])
    .nullable()
    .refine((val) => val !== null, { message: 'Pilih peran utamamu' }),
  skills: z.string().min(3, 'Tuliskan minimal satu keahlian'),
  bio: z.string().min(1, 'Wajib diisi').max(1000, 'Maksimal 1000 karakter'),
  aspiration: z.string().min(1, 'Wajib diisi').max(1000, 'Maksimal 1000 karakter'),
  agreed: z.literal(true, { message: 'Kamu harus menyetujui untuk melanjutkan' }),
});

export const organizationSchema = z.object({
  organization_name: z.string().min(2, 'Nama rombongan minimal 2 karakter'),
  organization_type: z
    .enum(['pemda', 'media', 'komunitas', 'kampus', 'swasta'])
    .nullable()
    .refine((val) => val !== null, { message: 'Pilih jenis rombongan' }),
  contact_name: z.string().min(2, 'Nama narahubung minimal 2 karakter'),
  contact_position: z.string().min(2, 'Jabatan wajib diisi'),
  contact_whatsapp: z
    .string()
    .min(1, 'No. WhatsApp wajib diisi')
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, 'Format nomor tidak valid'),
  contact_email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  contribution_offer: z.string().min(1, 'Wajib diisi').max(1000, 'Maksimal 1000 karakter'),
  agreed: z.literal(true, { message: 'Kamu harus menyetujui untuk melanjutkan' }),
});
