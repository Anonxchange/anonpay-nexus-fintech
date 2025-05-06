
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, FileCheck, CreditCard, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  
  // Extract the current tab from URL search parameters or default to 'account'
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'account';
  
  // Navigation items for the sidebar
  const navItems = [
    {
      id: 'account',
      label: 'Account',
      icon: User,
      onClick: () => navigate('/dashboard?tab=account')
    },
    {
      id: 'kyc',
      label: 'KYC Verification',
      icon: FileCheck,
      onClick: () => navigate('/dashboard?tab=kyc')
    },
    {
      id: 'withdrawal',
      label: 'Add Withdrawal Method',
      icon: CreditCard,
      onClick: () => navigate('/dashboard?tab=withdrawal')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => navigate('/dashboard?tab=settings')
    }
  ];
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={item.onClick}
                    isActive={currentTab === item.id}
                  >
                    <item.icon className="mr-2" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
