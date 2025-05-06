
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { VtuProduct } from "@/services/products/types";
import TransactionStatus from "./TransactionStatus";

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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackClick}
            className="mr-2"
            disabled={processing}
          >
            ← Back
          </Button>
          <div>
            <CardTitle>
              {selectedProduct?.name || 
              (selectedProvider && providerName) || 
              "Purchase Details"}
            </CardTitle>
            <CardDescription>Enter the required details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TransactionStatus 
            status={transactionStatus.status} 
            message={transactionStatus.message} 
          />

          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              placeholder="e.g., 08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={processing}
            />
          </div>
          
          {(selectedProduct?.category === "airtime" || category === "airtime") && (
            <div className="space-y-2">
              <Label htmlFor="airtime-amount">Amount (₦)</Label>
              <Input
                id="airtime-amount"
                type="number"
                placeholder="100"
                min="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={processing}
              />
            </div>
          )}
          
          {category === "data" && selectedProduct && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between">
                <span>Data Plan:</span>
                <span>{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Price:</span>
                <span>₦{selectedProduct.price.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          {(category === "airtime" && amount && parseFloat(amount) >= 100) && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₦{parseFloat(amount).toLocaleString()}</span>
              </div>
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={onBuyClick}
            disabled={
              processing || 
              !phoneNumber || 
              (category === "airtime" && (!amount || parseFloat(amount) < 100))
            }
          >
            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseDetails;
