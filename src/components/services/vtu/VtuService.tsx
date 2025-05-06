
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Wifi, Tv, Lightbulb } from "lucide-react";
import { useVtuPurchase } from "./hooks/useVtuPurchase";
import VtuCategoryContent from "./VtuCategoryContent";

interface VtuServiceProps {
  user: any;
}

const VtuService: React.FC<VtuServiceProps> = ({ user }) => {
  const {
    category,
    setCategory,
    products,
    loading,
    selectedProduct,
    amount,
    setAmount,
    phoneNumber,
    setPhoneNumber,
    processing,
    selectedProvider,
    currentStep,
    transactionStatus,
    handleProviderSelect,
    handleProductSelect,
    handleBackToProviders,
    handleBuy,
    getProviderName
  } = useVtuPurchase(user);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">VTU Services</h1>
      
      <Tabs defaultValue={category} onValueChange={setCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="airtime">
            <Phone className="mr-2 h-4 w-4" />
            Airtime
          </TabsTrigger>
          <TabsTrigger value="data">
            <Wifi className="mr-2 h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="cable">
            <Tv className="mr-2 h-4 w-4" />
            Cable TV
          </TabsTrigger>
          <TabsTrigger value="electricity">
            <Lightbulb className="mr-2 h-4 w-4" />
            Electricity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={category} className="mt-4">
          <VtuCategoryContent
            loading={loading}
            currentStep={currentStep}
            category={category}
            products={products}
            selectedProvider={selectedProvider}
            selectedProduct={selectedProduct}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            amount={amount}
            setAmount={setAmount}
            processing={processing}
            transactionStatus={transactionStatus}
            handleProviderSelect={handleProviderSelect}
            handleProductSelect={handleProductSelect}
            handleBackToProviders={handleBackToProviders}
            handleBuy={handleBuy}
            getProviderName={getProviderName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VtuService;
