
// Gift Card Type
export interface GiftCard {
  id: string;
  name: string;
  description: string;
  buyRate: number;
  sellRate: number;
  imageUrl?: string;
  isActive: boolean;
  currency?: string;
}

// VTU Product Type
export interface VtuProduct {
  id: string;
  name: string;
  description?: string;
  category: string;
  provider: string;
  minAmount?: number;
  maxAmount?: number;
  imageUrl?: string;
  isAvailable: boolean;
}

// VTU Bundle Type
export interface VtuBundle {
  id: string;
  name: string;
  amount: number;
  description?: string;
  validity: string;
  productId: string;
}
