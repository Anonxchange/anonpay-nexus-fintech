
// Define types for gift card product data

export interface GiftCard {
  id: string;
  name: string;
  description: string;
  buyRate: number;
  sellRate: number;
  imageUrl?: string;
  isActive: boolean;
  currency: string;
}

export interface VtuProduct {
  id: string;
  name: string;
  description?: string;
  category: 'airtime' | 'data' | 'electricity' | 'cable';
  provider: string;
  logoUrl?: string;
  imageUrl?: string; // Add imageUrl property
  isActive: boolean;
  hasVariants: boolean;
  variants?: VtuProductVariant[];
  price?: number;
}

export interface VtuProductVariant {
  id: string;
  name: string;
  price: number;
  value: string | number;
  description?: string;
  isActive: boolean;
}

// Update GiftCardSubmission type to have a union type for status
export interface GiftCardSubmission {
  id: string;
  user_id: string;
  user_name: string;
  card_id: string;
  card_name: string;
  card_code: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  image_url?: string;
}

// Add KycAction type to fix the import in AdminTabs.tsx
export type KycAction = "approve" | "reject";
