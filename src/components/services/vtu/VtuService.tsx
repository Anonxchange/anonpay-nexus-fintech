
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

interface VtuServiceProps {
  user: any;
}

const VtuService: React.FC<VtuServiceProps> = ({ user }) => {
  const [category, setCategory] = useState("airtime");
  const [products, setProducts] = useState<VtuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<VtuProduct | null>(null);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
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
        
        <TabsContent value={category}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {loading ? (
              <div className="col-span-full py-10 text-center">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-10 text-center">No products available in this category</div>
            ) : products.map((product) => (
              <Card 
                key={product.id}
                className={`cursor-pointer transition-all ${selectedProduct?.id === product.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="py-0">
                  {product.price > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Price:</span>
                      <span className="font-semibold">₦{product.price.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="py-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    {selectedProduct?.id === product.id ? 'Selected' : 'Select'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {selectedProduct && (
            <Card>
              <CardHeader>
                <CardTitle>Purchase {selectedProduct.name}</CardTitle>
                <CardDescription>Enter the required details</CardDescription>
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
                  
                  {selectedProduct.category === "airtime" && (
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
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>
                        {selectedProduct.category === "airtime" && amount && parseFloat(amount) >= 100
                          ? `₦${parseFloat(amount).toLocaleString()}`
                          : selectedProduct.price > 0
                            ? `₦${selectedProduct.price.toLocaleString()}`
                            : "Variable price"}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBuy}
                    disabled={
                      processing || 
                      !phoneNumber || 
                      (selectedProduct.category === "airtime" && (!amount || parseFloat(amount) < 100))
                    }
                  >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VtuService;
