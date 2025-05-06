
import { VtuProduct } from "@/services/products/types";

export interface TransactionStatusType {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export interface UseVtuPurchaseReturn {
  category: string;
  setCategory: (category: string) => void;
  products: VtuProduct[];
  loading: boolean;
  selectedProduct: VtuProduct | null;
  setSelectedProduct: (product: VtuProduct | null) => void;
  amount: string;
  setAmount: (amount: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  processing: boolean;
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  transactionStatus: TransactionStatusType;
  handleProviderSelect: (providerId: string) => void;
  handleProductSelect: (product: VtuProduct) => void;
  handleBackToProviders: () => void;
  handleBuy: () => void;
  getProviderName: () => string;
}
