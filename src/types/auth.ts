
import { User } from '@supabase/supabase-js';

export type KycStatus = 'approved' | 'pending' | 'rejected' | 'not_submitted';
export type AccountStatus = 'active' | 'suspended' | 'blocked';
export type KycAction = "approve" | "reject"; // Add KycAction type

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  kyc_status: KycStatus;
  wallet_balance: number;
  phone_number: string | null;
  role: string;
  email?: string;
  created_at: string;
  updated_at: string;
  account_status?: AccountStatus;
  kyc_submissions?: KycSubmission[];
}

export interface KycSubmission {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: KycStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
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
