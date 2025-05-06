
import React from "react";
import { VtuProduct } from "@/services/products/types";

interface PurchaseSummaryProps {
  selectedProduct: VtuProduct | null;
  amount: string;
  category: string;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  selectedProduct,
  amount,
  category,
}) => {
  // Only show for data plans or airtime with valid amount
  if (
    !(category === "data" && selectedProduct) && 
    !(category === "airtime" && amount && parseFloat(amount) >= 100)
  ) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      {category === "data" && selectedProduct && (
        <>
          <div className="flex justify-between">
            <span>Data Plan:</span>
            <span>{selectedProduct.name}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Price:</span>
            <span>₦{selectedProduct.price?.toLocaleString()}</span>
          </div>
        </>
      )}
      
      {category === "airtime" && amount && parseFloat(amount) >= 100 && (
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>₦{parseFloat(amount).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default PurchaseSummary;
