
import { useState } from "react";
import { VtuProduct } from "@/services/products/types";
import { networkProviders } from "../constants/networkProviders";
import { useVtuProducts } from "./useVtuProducts";
import { useVtuTransaction } from "./useVtuTransaction";
import { UseVtuPurchaseReturn } from "../types/vtuTypes";

export function useVtuPurchase(user: any): UseVtuPurchaseReturn {
  const [category, setCategory] = useState("airtime");
  const [selectedProduct, setSelectedProduct] = useState<VtuProduct | null>(null);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Provider, Step 2: Details
  
  // Use the refactored hooks
  const { products, loading } = useVtuProducts(category);
  const { processing, transactionStatus, handleBuyTransaction } = useVtuTransaction(user);
  
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    
    // Find matching product based on provider
    const matchingProduct = products.find(product => 
      product.name.toLowerCase().includes(providerId.toLowerCase())
    );
    
    if (matchingProduct) {
      setSelectedProduct(matchingProduct);
    }
    
    // Move to next step
    setCurrentStep(2);
  };
  
  const handleProductSelect = (product: VtuProduct) => {
    setSelectedProduct(product);
    setCurrentStep(2);
  };
  
  const handleBackToProviders = () => {
    setCurrentStep(1);
  };
  
  const getProviderName = () => {
    return networkProviders.find(p => p.id === selectedProvider)?.name || "";
  };
  
  const handleBuy = async () => {
    const success = await handleBuyTransaction(
      selectedProduct,
      selectedProvider,
      phoneNumber,
      amount,
      category
    );
    
    // Reset form on success
    if (success && currentStep === 1) {
      setAmount("");
      setPhoneNumber("");
      setSelectedProduct(null);
      setSelectedProvider("");
    }
  };

  // Reset states when category changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentStep(1);
    setSelectedProvider("");
    setSelectedProduct(null);
    setAmount("");
    setPhoneNumber("");
  };

  return {
    category,
    setCategory: handleCategoryChange,
    products,
    loading,
    selectedProduct,
    setSelectedProduct,
    amount,
    setAmount,
    phoneNumber, 
    setPhoneNumber,
    processing,
    selectedProvider,
    setSelectedProvider,
    currentStep,
    setCurrentStep,
    transactionStatus,
    handleProviderSelect,
    handleProductSelect,
    handleBackToProviders,
    handleBuy,
    getProviderName
  };
}
