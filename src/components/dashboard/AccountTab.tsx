
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AccountTab = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View and manage your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.name || "User"} />
              <AvatarFallback className="text-2xl">
                {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={() => navigate("/dashboard?tab=settings")}>
              Update Picture
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Full Name</h3>
              <p className="text-lg">{profile?.name || "Not set"}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">Email Address</h3>
              <p className="text-lg">{user?.email || "Not available"}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">Phone Number</h3>
              <p className="text-lg">{profile?.phone_number || "Not set"}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm text-gray-500">KYC Status</h3>
              <p className="text-lg capitalize">{profile?.kyc_status || "Not submitted"}</p>
            </div>
            
            <div className="pt-4">
              <Button onClick={() => navigate("/dashboard?tab=settings")}>
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
