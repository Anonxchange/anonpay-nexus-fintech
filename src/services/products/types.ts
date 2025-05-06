
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
  isActive: boolean;
  hasVariants: boolean;
  variants?: VtuProductVariant[];
}

export interface VtuProductVariant {
  id: string;
  name: string;
  price: number;
  value: string | number;
  description?: string;
  isActive: boolean;
}
