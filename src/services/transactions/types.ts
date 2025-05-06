
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  reference: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
  user_name?: string;
  // Changed the profiles type to be optional since the join might fail
  profiles?: {
    name: string;
  } | null;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  is_active: boolean;
  method_type: string; // Added this to match database column
  currency: string; // Added this to match database column
  address: string; // Added this to match database column
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  last_updated: string;
}

export interface DepositRequest {
  amount: number;
  payment_method: string;
  reference?: string;
  currency?: string;
}

export interface WithdrawalRequest {
  amount: number;
  destination: string;
  account_details?: string;
  reference?: string;
}

// Add the missing constant used in cryptoService.ts
export const MANUAL_NAIRA_RATE = 1500; // Default value, should be adjusted as needed
