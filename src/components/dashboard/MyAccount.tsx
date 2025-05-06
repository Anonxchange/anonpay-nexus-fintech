
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";

interface MyAccountProps {
  user: any;
}

const MyAccount: React.FC<MyAccountProps> = ({ user }) => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Account</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-base">{profile?.name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-base">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-base">{profile?.phone_number || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Status</label>
              <p className="text-base capitalize">{profile?.account_status || "Active"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
          <CardDescription>Overview of your account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Wallet Balance</h3>
              <p className="text-2xl font-bold">₦{profile?.wallet_balance?.toLocaleString() || "0.00"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">KYC Status</h3>
              <p className="text-xl font-semibold capitalize">{profile?.kyc_status || "Not Submitted"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
              <p className="text-xl font-semibold">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString() 
                  : "Unknown"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAccount;
