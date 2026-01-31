/**
 * User profile response
 */
export interface IUserProfile {
  id: string; // User ID (Logto sub)
  avatar?: string | null; // Avatar URL
  name?: string | null; // Full name
  primaryEmail?: string | null; // Primary email
  primaryPhone?: string | null; // Primary phone
  username?: string | null; // Username
}

/**
 * API Response wrapper for user profile
 */
export interface IApiResponse_UserProfileResponseDto {
  data?: IUserProfile;
  errors?: string[] | null;
  message?: string | null;
  meta?: unknown;
  success: boolean;
}
