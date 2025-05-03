
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WalletCard from "./WalletCard";
import StatusBadge from "../ui/StatusBadge";
import { Gift, CreditCard, Phone, ShieldCheck } from "lucide-react";
import { User, KycStatus } from "../../App";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface DashboardOverviewProps {
  user: User;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user }) => {
  const [fundAmount, setFundAmount] = useState("");
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Funding Request Submitted",
      description: `Your request to fund ₦${fundAmount} has been sent for processing.`,
    });
    
    setFundDialogOpen(false);
    setFundAmount("");
  };
  
  const services = [
    {
      title: "Crypto",
      description: "Buy, sell & trade cryptocurrency",
      icon: <CreditCard className="h-8 w-8 text-anonpay-primary" />,
      path: "/services/crypto",
      available: user.kycStatus === "approved",
    },
    {
      title: "Gift Cards",
      description: "Trade gift cards at great rates",
      icon: <Gift className="h-8 w-8 text-anonpay-primary" />,
      path: "/services/gift-cards",
      available: user.kycStatus === "approved",
    },
    {
      title: "VTU Services",
      description: "Airtime, data & bill payments",
      icon: <Phone className="h-8 w-8 text-anonpay-primary" />,
      path: "/services/vtu",
      available: true,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Wallet & Verification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WalletCard 
            balance={user.walletBalance} 
            onFund={() => setFundDialogOpen(true)}
          />
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <StatusBadge status={user.emailStatus} type="email" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">KYC</span>
                <StatusBadge status={user.kycStatus} type="kyc" />
              </div>
              
              {user.kycStatus !== "approved" && (
                <div className="pt-2">
                  <Link to="/kyc">
                    <Button size="sm" className="w-full">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {user.kycStatus === "not_submitted" ? "Complete KYC" : 
                       user.kycStatus === "rejected" ? "Resubmit KYC" : "View KYC Status"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Services Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.title} className={!service.available ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  {service.icon}
                  {!service.available && <StatusBadge status="pending" />}
                </div>
                <CardTitle className="text-lg mt-2">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={service.path}>
                  <Button 
                    variant={service.available ? "default" : "outline"} 
                    className="w-full" 
                    disabled={!service.available}
                  >
                    {service.available ? "Access" : "KYC Required"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Fund Wallet Dialog */}
      <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Your Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to fund your wallet with.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFundSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (NGN)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="100"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="bg-amber-50 p-3 rounded-md text-sm border border-amber-200">
                <p>For demo purposes, funding requests will be automatically approved.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setFundDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardOverview;
