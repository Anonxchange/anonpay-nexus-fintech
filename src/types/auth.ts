
import { User } from '@supabase/supabase-js';

export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected";
export type EmailStatus = "verified" | "unverified";

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  kyc_status: KycStatus;
  wallet_balance: number | null;
  phone_number: string | null;
  created_at: string | null;
  updated_at: string | null;
  email_status?: EmailStatus;
  role?: string;
}

export interface AuthContextType {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  verifyEmail: (userId: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
