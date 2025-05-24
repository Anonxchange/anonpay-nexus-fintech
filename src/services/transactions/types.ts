
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference?: string;
  created_at: string;
  updated_at: string;
  user_name?: string; // Add this field to fix the error in TransactionsTab
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  icon: string;
  is_active: boolean;
  method_type: string;
  currency: string;
  address?: string;
}

export type TransactionType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'crypto_deposit' 
  | 'crypto_withdrawal'
  | 'gift_card_sell'
  | 'gift_card_buy'
  | 'vtu_purchase';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
