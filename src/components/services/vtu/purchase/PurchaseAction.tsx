
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PurchaseActionProps {
  onBuyClick: () => void;
  processing: boolean;
  disabled: boolean;
}

const PurchaseAction: React.FC<PurchaseActionProps> = ({ 
  onBuyClick, 
  processing,
  disabled 
}) => {
  return (
    <Button 
      className="w-full" 
      onClick={onBuyClick}
      disabled={disabled || processing}
    >
      {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {processing ? "Processing..." : "Pay Now"}
    </Button>
  );
};

export default PurchaseAction;
