
export interface GiftCard {
  id: string;
  name: string;
  description: string;
  buy_rate: number; // The rate at which we buy from users
  sell_rate: number; // The rate at which we sell to users
  image_url: string;
  is_active: boolean;
  currency: string;
  min_amount?: number;
  max_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface GiftCardSubmission {
  id: string;
  user_id: string;
  user_name?: string;
  card_id: string;
  card_name: string;
  card_code: string;
  receipt_image_url: string;
  amount: number;
  currency: string;
  comments?: string;
  admin_notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export type KycAction = 'approve' | 'reject';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface EbillsTopUpRequestParams {
  phone: string;
  network: string;
  amount: number;
}

export interface EbillsTopUpResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface VtuProviderOption {
  id: string;
  name: string;
  logo: string;
  productType: string;
  products?: VtuProduct[];
}

export interface VtuProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  reference?: string;
}

export interface DataPlan {
  id: string;
  name: string;
  price: number;
  validity: string;
  networkId: string;
}
