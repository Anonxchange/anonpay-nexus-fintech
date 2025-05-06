
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PurchaseFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  processing: boolean;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  amount,
  setAmount,
  category,
  processing
}) => {
  return (
    <div className="space-y-4">
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
      
      {(category === "airtime") && (
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
    </div>
  );
};

export default PurchaseForm;
