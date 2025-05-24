
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference?: string;
  created_at: string;
  updated_at: string;
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
