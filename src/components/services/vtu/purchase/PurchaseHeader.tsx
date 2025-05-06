
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VtuProduct } from "@/services/products/types";

interface PurchaseHeaderProps {
  selectedProduct: VtuProduct | null;
  providerName: string;
  selectedProvider: string;
  onBackClick: () => void;
  processing: boolean;
}

const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({
  selectedProduct,
  providerName,
  selectedProvider,
  onBackClick,
  processing,
}) => {
  return (
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
  );
};

export default PurchaseHeader;
