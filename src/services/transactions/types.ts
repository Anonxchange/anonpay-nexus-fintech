
// Transaction types
export type TransactionType = "deposit" | "withdrawal" | "fund";
export type TransactionStatus = "pending" | "completed" | "failed";

// Transaction interface
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  reference?: string;
  status: TransactionStatus;
  created_at: string;
  updated_at?: string;
}

// Payment method interface
export interface PaymentMethod {
  id: string;
  method_type: string;
  currency: string;
  address: string;
}

// Constants
export const MANUAL_NAIRA_RATE = 1590;
