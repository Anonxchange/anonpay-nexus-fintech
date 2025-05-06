
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  reference: string;
  status: string;
  created_at: string;
  user_name?: string;
  profiles?: {
    name: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  is_active: boolean;
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
