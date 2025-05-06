
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VtuProduct } from "@/services/products/types";
import TransactionStatus from "./TransactionStatus";
import PurchaseHeader from "./purchase/PurchaseHeader";
import PurchaseForm from "./purchase/PurchaseForm";
import PurchaseSummary from "./purchase/PurchaseSummary";
import PurchaseAction from "./purchase/PurchaseAction";

interface PurchaseDetailsProps {
  selectedProduct: VtuProduct | null;
  selectedProvider: string;
  providerName: string;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  processing: boolean;
  category: string;
  onBackClick: () => void;
  onBuyClick: () => void;
  transactionStatus: {
    status: "idle" | "loading" | "success" | "error";
    message: string;
  };
}

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({
  selectedProduct,
  selectedProvider,
  providerName,
  phoneNumber,
  setPhoneNumber,
  amount,
  setAmount,
  processing,
  category,
  onBackClick,
  onBuyClick,
  transactionStatus,
}) => {
  // Determine if the purchase button should be disabled
  const isPurchaseDisabled = 
    processing || 
    !phoneNumber || 
    (category === "airtime" && (!amount || parseFloat(amount) < 100));
  
  return (
    <Card>
      <PurchaseHeader 
        selectedProduct={selectedProduct}
        providerName={providerName}
        selectedProvider={selectedProvider}
        onBackClick={onBackClick}
        processing={processing}
      />
      <CardContent>
        <div className="space-y-4">
          <TransactionStatus 
            status={transactionStatus.status} 
            message={transactionStatus.message} 
          />

          <PurchaseForm 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            amount={amount}
            setAmount={setAmount}
            category={category}
            processing={processing}
          />
          
          <PurchaseSummary 
            selectedProduct={selectedProduct}
            amount={amount}
            category={category}
          />
          
          <PurchaseAction 
            onBuyClick={onBuyClick}
            processing={processing}
            disabled={isPurchaseDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseDetails;
