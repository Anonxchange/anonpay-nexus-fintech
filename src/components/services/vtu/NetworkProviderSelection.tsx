import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VtuProduct } from "@/services/products/types";
import { networkProviders } from "./constants/networkProviders";

interface NetworkProviderSelectionProps {
  selectedProvider: string;
  onProviderSelect: (providerId: string) => void;
  category: string;
  products: VtuProduct[];
  selectedProduct: VtuProduct | null;
  onProductSelect: (product: VtuProduct) => void;
}

const NetworkProviderSelection: React.FC<NetworkProviderSelectionProps> = ({
  selectedProvider,
  onProviderSelect,
  category,
  products,
  selectedProduct,
  onProductSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Network Provider</h3>
      <RadioGroup 
        value={selectedProvider} 
        onValueChange={onProviderSelect} 
        className="grid grid-cols-2 gap-4"
      >
        {networkProviders.map((provider) => (
          <div key={provider.id} className="flex items-center space-x-2">
            <RadioGroupItem value={provider.id} id={provider.id} />
            <Label htmlFor={provider.id} className="flex items-center cursor-pointer">
              <span className="mr-2 text-xl">{provider.logo}</span>
              <span>{provider.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {category === "cable" && (
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Select Cable TV Provider</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card 
                key={product.id}
                className={`cursor-pointer transition-all ${selectedProduct?.id === product.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onProductSelect(product)}
              >
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  {product.price > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Price:</span>
                      <span className="font-semibold">₦{product.price.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {category === "electricity" && (
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Select Electricity Provider</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card 
                key={product.id}
                className={`cursor-pointer transition-all ${selectedProduct?.id === product.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onProductSelect(product)}
              >
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkProviderSelection;
