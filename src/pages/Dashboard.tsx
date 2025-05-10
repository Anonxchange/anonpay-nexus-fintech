
import React, { useState } from "react";
import { useAuth } from "../contexts/auth";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  CreditCard as BankIcon, 
  User as UserIcon, 
  Settings, 
  FileText as KycIcon,
  Gift as GiftCardIcon 
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import MyAccount from "../components/dashboard/MyAccount";
import KycService from "../components/dashboard/KycService";
import AddBankAccount from "../components/dashboard/AddBankAccount";
import GiftCardService from "../components/services/giftcards/GiftCardService";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview user={user} />;
      case "myaccount":
        return <MyAccount user={user} />;
      case "kyc":
        return <KycService user={user} />;
      case "bankaccount":
        return <AddBankAccount user={user} />;
      case "giftcard":
        return <GiftCardService user={user} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };
  
  return (
    <AppLayout title="Dashboard">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          <Sidebar>
            <SidebarHeader className="border-b px-6 py-2">
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("overview")} 
                    isActive={activeTab === "overview"}
                    tooltip="Services"
                  >
                    <Settings className="mr-2" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("myaccount")} 
                    isActive={activeTab === "myaccount"}
                    tooltip="My Account"
                  >
                    <UserIcon className="mr-2" />
                    <span>My Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("kyc")} 
                    isActive={activeTab === "kyc"}
                    tooltip="KYC Service"
                  >
                    <KycIcon className="mr-2" />
                    <span>KYC Service</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("bankaccount")} 
                    isActive={activeTab === "bankaccount"}
                    tooltip="Add Bank Account"
                  >
                    <BankIcon className="mr-2" />
                    <span>Bank Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("giftcard")} 
                    isActive={activeTab === "giftcard"}
                    tooltip="Gift Cards"
                  >
                    <GiftCardIcon className="mr-2" />
                    <span>Gift Cards</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="p-6">
              {renderContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppLayout>
  );
};

export default Dashboard;
