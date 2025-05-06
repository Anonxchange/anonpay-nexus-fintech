
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { VtuProduct } from "@/services/products/types";
import { getVtuProducts, getVtuProductsByCategory, buyVtuProduct } from "@/services/products/vtuService";
import { Phone, Wifi, Tv, Lightbulb, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VtuServiceProps {
  user: any;
}

// Network providers for airtime/data
const networkProviders = [
  { id: "mtn", name: "MTN", logo: "🟡" },
  { id: "airtel", name: "Airtel", logo: "🔴" },
  { id: "glo", name: "Glo", logo: "🟢" },
  { id: "9mobile", name: "9Mobile", logo: "🟠" },
];

const VtuService: React.FC<VtuServiceProps> = ({ user }) => {
  const [category, setCategory] = useState("airtime");
  const [products, setProducts] = useState<VtuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<VtuProduct | null>(null);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Provider, Step 2: Details
  const { toast } = useToast();
  
  useEffect(() => {
    // Reset steps when category changes
    setCurrentStep(1);
    setSelectedProvider("");
    setSelectedProduct(null);
    setAmount("");
    setPhoneNumber("");
    
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
  
  const handleBackToProviders = () => {
    setCurrentStep(1);
  };
  
  const handleBuy = async () => {
    if (!selectedProduct) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a product"
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
    
    let buyAmount = selectedProduct.price;
    
    // For airtime, use user-input amount
    if (selectedProduct.category === "airtime") {
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
    
    try {
      const success = await buyVtuProduct(user.id, selectedProduct.id, buyAmount, phoneNumber);
      
      if (success) {
        toast({
          title: "Purchase Successful",
          description: `Your ${selectedProduct.name} purchase was successful`,
        });
        setAmount("");
        setPhoneNumber("");
        setSelectedProduct(null);
        setSelectedProvider("");
        setCurrentStep(1);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Failed to buy VTU product:", error);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: "Insufficient funds or network error"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const renderProviderSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Network Provider</h3>
      <RadioGroup value={selectedProvider} onValueChange={handleProviderSelect} className="grid grid-cols-2 gap-4">
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
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentStep(2);
                }}
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
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentStep(2);
                }}
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
  
  const renderDetailsStep = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToProviders}
            className="mr-2"
          >
            ← Back
          </Button>
          <div>
            <CardTitle>
              {selectedProduct?.name || 
               (selectedProvider && networkProviders.find(p => p.id === selectedProvider)?.name) || 
               "Purchase Details"}
            </CardTitle>
            <CardDescription>Enter the required details</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              placeholder="e.g., 08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
            onClick={handleBuy}
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
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading products...</p>
            </div>
          ) : currentStep === 1 ? (
            renderProviderSelection()
          ) : (
            renderDetailsStep()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VtuService;
