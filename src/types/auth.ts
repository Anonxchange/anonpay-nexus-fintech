
import { User } from '@supabase/supabase-js';
import { KycStatus } from '../App';

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  kyc_status: KycStatus;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  verifyEmail: (userId: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}
