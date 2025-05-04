
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneOutgoing, PhoneIncoming } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VtuServiceProps {
  user: any;
}

const VtuService: React.FC<VtuServiceProps> = ({ user }) => {
  const [vtuTab, setVtuTab] = useState("airtime");
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("MTN");
  const [selectedPlan, setSelectedPlan] = useState("1GB");

  const handleVtuAction = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const actionType = vtuTab === "airtime" ? "Airtime recharge" : "Data purchase";
    const details = vtuTab === "airtime" 
      ? `${amount} Naira to ${phoneNumber}` 
      : `${selectedPlan} for ${phoneNumber}`;

    toast({
      title: `${actionType} successful`,
      description: `Your ${actionType.toLowerCase()} of ${details} has been processed.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VTU Services</CardTitle>
        <CardDescription>Purchase airtime, data, and other virtual top-up services.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="airtime" onValueChange={setVtuTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="airtime">Airtime</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="airtime" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="network">Select Network</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN">MTN</SelectItem>
                    <SelectItem value="AIRTEL">Airtel</SelectItem>
                    <SelectItem value="GLO">Glo</SelectItem>
                    <SelectItem value="9MOBILE">9Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Enter phone number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <Button onClick={handleVtuAction} className="w-full">
                <PhoneOutgoing className="mr-2 h-4 w-4" />
                Buy Airtime
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="network">Select Network</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN">MTN</SelectItem>
                    <SelectItem value="AIRTEL">Airtel</SelectItem>
                    <SelectItem value="GLO">Glo</SelectItem>
                    <SelectItem value="9MOBILE">9Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="plan">Select Data Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Data Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1GB">1GB - 30 Days</SelectItem>
                    <SelectItem value="2GB">2GB - 30 Days</SelectItem>
                    <SelectItem value="5GB">5GB - 30 Days</SelectItem>
                    <SelectItem value="10GB">10GB - 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Enter phone number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <Button onClick={handleVtuAction} className="w-full">
                <PhoneIncoming className="mr-2 h-4 w-4" />
                Buy Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VtuService;
