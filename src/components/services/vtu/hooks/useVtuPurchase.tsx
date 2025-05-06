
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VtuProduct } from "@/services/products/types";
import { getVtuProducts, getVtuProductsByCategory, buyVtuProduct } from "@/services/products/vtuService";

// Network provider mapping
const networkProviders = [
  { id: "mtn", name: "MTN", logo: "🟡" },
  { id: "airtel", name: "Airtel", logo: "🔴" },
  { id: "glo", name: "Glo", logo: "🟢" },
  { id: "9mobile", name: "9Mobile", logo: "🟠" },
];

export function useVtuPurchase(user: any) {
  const [category, setCategory] = useState("airtime");
  const [products, setProducts] = useState<VtuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<VtuProduct | null>(null);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Provider, Step 2: Details
  const [transactionStatus, setTransactionStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Reset steps when category changes
    setCurrentStep(1);
    setSelectedProvider("");
    setSelectedProduct(null);
    setAmount("");
    setPhoneNumber("");
    setTransactionStatus({ status: "idle", message: "" });
    
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data: VtuProduct[];
        if (category) {
          data = await getVtuProductsByCategory(category);
        } else {
          data = await getVtuProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error("Failed to load VTU products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category, toast]);
  
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
    setTransactionStatus({ status: "idle", message: "" });
  };
  
  const getProviderName = () => {
    return networkProviders.find(p => p.id === selectedProvider)?.name || "";
  };
  
  const handleBuy = async () => {
    if (!selectedProvider) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a network provider"
      });
      return;
    }
    
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a phone number"
      });
      return;
    }
    
    let buyAmount = selectedProduct?.price || 0;
    
    // For airtime, use user-input amount
    if (category === "airtime") {
      const inputAmount = parseFloat(amount);
      if (isNaN(inputAmount) || inputAmount < 100) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid amount (minimum ₦100)"
        });
        return;
      }
      buyAmount = inputAmount;
    }
    
    setProcessing(true);
    setTransactionStatus({ status: "loading", message: "Processing your request..." });
    
    try {
      // Simulate API call
      // In a real app, this would call a real VTU API
      
      // Use mock purchase function
      const success = await buyVtuProduct(user.id, selectedProduct?.id || "", buyAmount, phoneNumber);
      
      if (success) {
        // Add delay to simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setTransactionStatus({
          status: "success",
          message: `Your ${category} purchase was successful`
        });
        
        toast({
          title: "Purchase Successful",
          description: `Your ${category} purchase was successful`,
        });
      } else {
        throw new Error("Transaction failed");
      }
      
      // Reset form on success
      if (currentStep === 1) {
        setAmount("");
        setPhoneNumber("");
        setSelectedProduct(null);
        setSelectedProvider("");
      }
    } catch (error: any) {
      console.error("Failed to buy VTU product:", error);
      
      setTransactionStatus({
        status: "error",
        message: error.message || "Failed to complete your purchase. Please try again."
      });
      
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error.message || "Failed to complete your purchase. Please try again."
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    category,
    setCategory,
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
