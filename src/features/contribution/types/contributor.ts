// ============================================================================
// SUBMISSION TYPES
// ============================================================================

export type SubmissionType = 'personal' | 'organization';
export type PersonalRole = 'perakit' | 'penyuara' | 'perumus' | 'saksi_fakta' | 'lainnya';
export type OrganizationType = 'pemda' | 'media' | 'komunitas' | 'kampus' | 'swasta';

// ============================================================================
// API DTOs
// ============================================================================

export interface ICreateContributorDto {
  submission_type: SubmissionType;
  agreed?: boolean;
  // Personal fields
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  role?: string | null;
  skills?: string | null;
  bio?: string | null;
  portfolio_url?: string | null;
  aspiration?: string | null;
  // Organization fields
  organization_name?: string | null;
  organization_type?: string | null;
  contact_name?: string | null;
  contact_position?: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;
  contribution_offer?: string | null;
}

export interface IContributorResponseDto {
  id: string;
  submission_type: string;
}

// ============================================================================
// FORM STATE
// ============================================================================

export interface ContributorFormData {
  submission_type: SubmissionType | null;
  // Personal fields
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  role: PersonalRole | null;
  skills: string;
  bio: string;
  portfolio_url: string;
  aspiration: string;
  // Organization fields
  organization_name: string;
  organization_type: OrganizationType | null;
  contact_name: string;
  contact_position: string;
  contact_whatsapp: string;
  contact_email: string;
  contribution_offer: string;
  // Both
  agreed: boolean;
}

export const INITIAL_CONTRIBUTOR_FORM: ContributorFormData = {
  submission_type: null,
  name: '',
  email: '',
  whatsapp: '',
  city: '',
  role: null,
  skills: '',
  bio: '',
  portfolio_url: '',
  aspiration: '',
  organization_name: '',
  organization_type: null,
  contact_name: '',
  contact_position: '',
  contact_whatsapp: '',
  contact_email: '',
  contribution_offer: '',
  agreed: false,
};

// ============================================================================
// OPTIONS DATA
// ============================================================================

export const TYPE_OPTIONS = [
  {
    value: 'personal' as const,
    label: 'Pribadi',
    description: 'Bergabung atas nama diri sendiri dengan keahlian yang kamu punya',
  },
  {
    value: 'organization' as const,
    label: 'Rombongan',
    description: 'Mewakili lembaga, komunitas, media, atau organisasi',
  },
];

export const PERSONAL_ROLES = [
  {
    value: 'perakit' as const,
    icon: '🔧',
    label: 'Perakit',
    subtitle: 'Builder',
    description: 'Developer, UI/UX Designer, Data Scientist, DevOps',
  },
  {
    value: 'penyuara' as const,
    icon: '📢',
    label: 'Penyuara',
    subtitle: 'Amplifier',
    description: 'Penulis, Desainer Grafis, Podcaster, Videografer',
  },
  {
    value: 'perumus' as const,
    icon: '🧠',
    label: 'Perumus',
    subtitle: 'Thinker',
    description: 'Ahli Hukum, Peneliti, Analis Kebijakan, Akademisi',
  },
  {
    value: 'saksi_fakta' as const,
    icon: '👁️',
    label: 'Saksi Fakta',
    subtitle: 'Witness',
    description: 'Warga yang punya cerita dari lapangan, ahli sektoral',
  },
  {
    value: 'lainnya' as const,
    icon: '✨',
    label: 'Lainnya',
    subtitle: 'Wildcard',
    description: 'Punya keahlian unik yang belum disebutkan di atas',
  },
];

export const ORG_TYPES = [
  { value: 'pemda' as const, icon: '🏛️', label: 'Pemerintah Daerah' },
  { value: 'media' as const, icon: '📺', label: 'Media / Podcast' },
  { value: 'komunitas' as const, icon: '👥', label: 'Komunitas / Paguyuban' },
  { value: 'kampus' as const, icon: '🎓', label: 'Kampus / Akademisi' },
  { value: 'swasta' as const, icon: '🏢', label: 'Swasta / Lainnya' },
];
