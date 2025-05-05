
export interface GiftCard {
  id: string;
  name: string;
  description: string;
  buyRate: number;
  sellRate: number;
  imageUrl: string;
  isActive: boolean;
}

export interface VtuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  category: "airtime" | "data" | "electricity" | "cable";
}

export interface RateInfo {
  id: string;
  name: string;
  buyRate: number;
  sellRate: number;
  lastUpdated: string;
}

// We don't need to export these functions here since they're already exported from their respective service files
