'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMutation } from '@/hooks/api/use-mutation';

import { SectionHeader } from './SectionHeader';
import { FormField } from './FormField';
import { personalSchema, organizationSchema } from '../schemas/contributor-schema';
import type {
  ContributorFormData,
  ICreateContributorDto,
  IContributorResponseDto,
  PersonalRole,
  OrganizationType,
} from '../types/contributor';
import {
  INITIAL_CONTRIBUTOR_FORM,
  TYPE_OPTIONS,
  PERSONAL_ROLES,
  ORG_TYPES,
} from '../types/contributor';

export function ContributorForm() {
  const router = useRouter();
  const [form, setForm] = useState<ContributorFormData>(INITIAL_CONTRIBUTOR_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: registerContributor, isPending } = useMutation<
    IContributorResponseDto,
    ICreateContributorDto
  >({
    resource: 'contributors/register',
    onSuccess: () => {
      const params = new URLSearchParams({ type: form.submission_type || '' });
      router.push(`/contribution/success?${params.toString()}`);
    },
    onError: (error) => {
      console.error('Submission error:', error);
      toast.error('Gagal mengirim data. Coba lagi, ya.');
    },
  });

  const updateField = <K extends keyof ContributorFormData>(
    key: K,
    value: ContributorFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    setErrors({});

    const schema = form.submission_type === 'personal' ? personalSchema : organizationSchema;
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error('Lengkapi dulu data yang diperlukan');
      return;
    }

    const payload: ICreateContributorDto =
      form.submission_type === 'personal'
        ? {
            submission_type: 'personal',
            name: form.name,
            email: form.email,
            whatsapp: form.whatsapp,
            city: form.city,
            role: form.role,
            skills: form.skills,
            bio: form.bio,
            portfolio_url: form.portfolio_url || null,
            aspiration: form.aspiration,
            agreed: form.agreed,
          }
        : {
            submission_type: 'organization',
            organization_name: form.organization_name,
            organization_type: form.organization_type,
            contact_name: form.contact_name,
            contact_position: form.contact_position,
            contact_whatsapp: form.contact_whatsapp,
            contact_email: form.contact_email,
            contribution_offer: form.contribution_offer,
            agreed: form.agreed,
          };

    registerContributor(payload);
  };

  return (
    <>
      {/* ================================================================ */}
      {/* TYPE SELECTION */}
      {/* ================================================================ */}
      <div className="bg-card border-border mb-8 rounded-2xl border p-6 sm:p-8">
        <SectionHeader
          badge="Langkah 1"
          title="Kamu datang sebagai..."
          subtitle="Pilih salah satu yang sesuai"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.value === 'personal' ? User : Building2;
            const isSelected = form.submission_type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  updateField('submission_type', opt.value);
                  if (opt.value === 'personal') {
                    updateField('organization_name', '');
                    updateField('organization_type', null);
                  } else {
                    updateField('role', null);
                    updateField('skills', '');
                  }
                }}
                className={`rounded-xl border-2 p-6 text-left transition-all duration-200 hover:scale-[1.01] ${
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon size={24} />
                </div>
                <h4 className="text-foreground mb-1 text-lg font-semibold">{opt.label}</h4>
                <p className="text-muted-foreground text-sm">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* JALUR A: PRIBADI */}
      {/* ================================================================ */}
      {form.submission_type === 'personal' && (
        <div className="space-y-8">
          {/* Data Diri */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 2"
              title="Kenalan dulu"
              subtitle="Data dasar supaya kami bisa menghubungimu"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="Nama / Panggilan" required error={errors.name}>
                <Input
                  placeholder="Panggil aku..."
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={errors.name ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField label="Email" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField
                label="No. WhatsApp"
                required
                hint="Untuk koordinasi via grup WA"
                error={errors.whatsapp}
              >
                <Input
                  type="tel"
                  placeholder="08123456789"
                  value={form.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  className={errors.whatsapp ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField label="Domisili" required hint="Kota / Kabupaten" error={errors.city}>
                <Input
                  placeholder="Kota tempat tinggal"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={errors.city ? 'border-destructive' : ''}
                />
              </FormField>
            </div>
          </div>

          {/* Pilih Peran */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 3"
              title="Pilih peran utamamu"
              subtitle="Pilih satu yang paling mewakili. Nanti bisa berubah kok."
            />

            {errors.role && <p className="text-destructive mb-4 text-sm">{errors.role}</p>}

            <RadioGroup
              value={form.role || ''}
              onValueChange={(val) => updateField('role', val as PersonalRole)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {PERSONAL_ROLES.map((role) => {
                const isSelected = form.role === role.value;
                return (
                  <label
                    key={role.value}
                    className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 hover:scale-[1.01] ${
                      isSelected
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={role.value} className="sr-only" />
                    <div className="mb-3 text-3xl">{role.icon}</div>
                    <h4 className="text-foreground font-semibold">{role.label}</h4>
                    <p className="text-primary mb-2 text-xs">{role.subtitle}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {role.description}
                    </p>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          {/* Amunisi & Portfolio */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 4"
              title="Tentang keahlianmu"
              subtitle="Ceritakan apa yang bisa kamu bawa ke meja ini"
            />

            <div className="space-y-6">
              <FormField
                label="Ceritakan singkat mengenai spesialisasi keahlianmu, dan kontribusi apa yang bisa kamu berikan dalam eksperimen ini?"
                required
                hint={`${form.bio.length}/1000 karakter`}
                error={errors.bio}
              >
                <Textarea
                  placeholder="Contoh: Saya praktisi Hukum Tata Negara dengan pengalaman 10 tahun di legislative drafting. Saya bisa membantu mereview produk hukum. Atau: Saya Data Scientist spesialis NLP, bisa membantu analisis sentimen publik."
                  rows={5}
                  maxLength={1000}
                  value={form.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  className={`resize-none ${errors.bio ? 'border-destructive' : ''}`}
                />
              </FormField>

              <FormField
                label="Keahlian Teknis"
                required
                hint="Pisahkan dengan koma"
                error={errors.skills}
              >
                <Input
                  placeholder="Python, React, Figma, Public Speaking, Riset Kebijakan"
                  value={form.skills}
                  onChange={(e) => updateField('skills', e.target.value)}
                  className={errors.skills ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField
                label="Jejak digital"
                hint="LinkedIn, GitHub, Portfolio, atau karya yang bisa kami lihat"
              >
                <Input
                  placeholder="https://linkedin.com/in/..."
                  value={form.portfolio_url}
                  onChange={(e) => updateField('portfolio_url', e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* Urun Angan */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 5"
              title="Satu hal yang ingin kamu benahi"
              subtitle="Dari hubungan Rakyat dan Negara, apa yang menurutmu paling mendesak?"
            />

            <FormField
              label="Urun anganmu"
              required
              hint={`${form.aspiration.length}/1000 karakter`}
              error={errors.aspiration}
            >
              <Textarea
                placeholder="Tulis bebas di sini... Apa yang membuatmu gatal ingin bergerak?"
                rows={4}
                maxLength={1000}
                value={form.aspiration}
                onChange={(e) => updateField('aspiration', e.target.value)}
                className={`resize-none ${errors.aspiration ? 'border-destructive' : ''}`}
              />
            </FormField>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* JALUR B: ROMBONGAN */}
      {/* ================================================================ */}
      {form.submission_type === 'organization' && (
        <div className="space-y-8">
          {/* Profil Rombongan */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 2"
              title="Profil rombonganmu"
              subtitle="Lembaga atau komunitas yang kamu wakili"
            />

            <div className="space-y-6">
              <FormField
                label="Nama Rombongan"
                required
                hint="Nama lembaga, komunitas, atau organisasi"
                error={errors.organization_name}
              >
                <Input
                  placeholder="Contoh: Pemkot Surabaya, Podcast XYZ, Komunitas ABC"
                  value={form.organization_name}
                  onChange={(e) => updateField('organization_name', e.target.value)}
                  className={errors.organization_name ? 'border-destructive' : ''}
                />
              </FormField>

              <div>
                <label className="text-foreground mb-3 block text-sm font-medium">
                  Jenis Rombongan <span className="text-primary">*</span>
                </label>
                {errors.organization_type && (
                  <p className="text-destructive mb-3 text-sm">{errors.organization_type}</p>
                )}
                <RadioGroup
                  value={form.organization_type || ''}
                  onValueChange={(val) => updateField('organization_type', val as OrganizationType)}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                >
                  {ORG_TYPES.map((org) => {
                    const isSelected = form.organization_type === org.value;
                    return (
                      <label
                        key={org.value}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={org.value} className="sr-only" />
                        <div className="mb-2 text-2xl">{org.icon}</div>
                        <div className="text-foreground text-sm font-medium">{org.label}</div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Narahubung */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 3"
              title="Siapa yang bisa kami hubungi?"
              subtitle="Data narahubung untuk koordinasi lebih lanjut"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="Nama Narahubung" required error={errors.contact_name}>
                <Input
                  placeholder="Nama lengkap"
                  value={form.contact_name}
                  onChange={(e) => updateField('contact_name', e.target.value)}
                  className={errors.contact_name ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField label="Jabatan" required error={errors.contact_position}>
                <Input
                  placeholder="Jabatan di organisasi"
                  value={form.contact_position}
                  onChange={(e) => updateField('contact_position', e.target.value)}
                  className={errors.contact_position ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField label="No. WhatsApp" required error={errors.contact_whatsapp}>
                <Input
                  type="tel"
                  placeholder="08123456789"
                  value={form.contact_whatsapp}
                  onChange={(e) => updateField('contact_whatsapp', e.target.value)}
                  className={errors.contact_whatsapp ? 'border-destructive' : ''}
                />
              </FormField>

              <FormField label="Email" required error={errors.contact_email}>
                <Input
                  type="email"
                  placeholder="email@organisasi.com"
                  value={form.contact_email}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  className={errors.contact_email ? 'border-destructive' : ''}
                />
              </FormField>
            </div>
          </div>

          {/* Urunan */}
          <div className="bg-card border-border rounded-2xl border p-6 sm:p-8">
            <SectionHeader
              badge="Langkah 4"
              title="Bentuk kolaborasi"
              subtitle="Apa yang bisa rombonganmu kontribusikan?"
            />

            <FormField
              label="Urunan yang ditawarkan"
              required
              hint={`${form.contribution_offer.length}/1000 karakter`}
              error={errors.contribution_offer}
            >
              <Textarea
                placeholder="Ceritakan bentuk dukungan atau kolaborasi yang bisa diberikan. Misalnya: pilot project, slot publikasi, akses data, dukungan riset, dll."
                rows={4}
                maxLength={1000}
                value={form.contribution_offer}
                onChange={(e) => updateField('contribution_offer', e.target.value)}
                className={`resize-none ${errors.contribution_offer ? 'border-destructive' : ''}`}
              />
            </FormField>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PERSETUJUAN & SUBMIT */}
      {/* ================================================================ */}
      {form.submission_type && (
        <div className="bg-card border-border mt-8 rounded-2xl border p-6 sm:p-8">
          <SectionHeader title="Satu langkah lagi" subtitle="Konfirmasi dan kirim pendaftaranmu" />

          {/* Agreement */}
          <div
            className={`mb-6 flex items-start gap-4 rounded-xl border p-4 ${
              errors.agreed ? 'bg-destructive/10 border-destructive' : 'bg-background border-border'
            }`}
          >
            <Checkbox
              id="agreed"
              checked={form.agreed}
              onCheckedChange={(checked) => updateField('agreed', checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="agreed" className="text-foreground cursor-pointer leading-relaxed">
              Saya paham ini gerakan gotong royong tanpa bayaran, dan saya siap dihubungi untuk
              tandang gawe bersama.
            </label>
          </div>
          {errors.agreed && <p className="text-destructive mb-4 text-sm">{errors.agreed}</p>}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-6 text-lg font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                Kirim Pendaftaran
              </>
            )}
          </Button>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            Kami akan menghubungimu jika keahlianmu dibutuhkan.
          </p>
        </div>
      )}
    </>
  );
}
