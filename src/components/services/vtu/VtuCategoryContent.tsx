
import React from "react";
import { Loader2 } from "lucide-react";
import { VtuProduct } from "@/services/products/types";
import NetworkProviderSelection from "./NetworkProviderSelection";
import PurchaseDetails from "./PurchaseDetails";

interface VtuCategoryContentProps {
  loading: boolean;
  currentStep: number;
  category: string;
  products: VtuProduct[];
  selectedProvider: string;
  selectedProduct: VtuProduct | null;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  processing: boolean;
  transactionStatus: {
    status: "idle" | "loading" | "success" | "error";
    message: string;
  };
  handleProviderSelect: (providerId: string) => void;
  handleProductSelect: (product: VtuProduct) => void;
  handleBackToProviders: () => void;
  handleBuy: () => void;
  getProviderName: () => string;
}

const VtuCategoryContent: React.FC<VtuCategoryContentProps> = ({
  loading,
  currentStep,
  category,
  products,
  selectedProvider,
  selectedProduct,
  phoneNumber,
  setPhoneNumber,
  amount,
  setAmount,
  processing,
  transactionStatus,
  handleProviderSelect,
  handleProductSelect,
  handleBackToProviders,
  handleBuy,
  getProviderName,
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading products...</p>
      </div>
    );
  }
  
  if (currentStep === 1) {
    return (
      <NetworkProviderSelection
        selectedProvider={selectedProvider}
        onProviderSelect={handleProviderSelect}
        category={category}
        products={products}
        selectedProduct={selectedProduct}
        onProductSelect={handleProductSelect}
      />
    );
  }
  
  return (
    <PurchaseDetails
      selectedProduct={selectedProduct}
      selectedProvider={selectedProvider}
      providerName={getProviderName()}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      amount={amount}
      setAmount={setAmount}
      processing={processing}
      category={category}
      onBackClick={handleBackToProviders}
      onBuyClick={handleBuy}
      transactionStatus={transactionStatus}
    />
  );
};

export default VtuCategoryContent;
