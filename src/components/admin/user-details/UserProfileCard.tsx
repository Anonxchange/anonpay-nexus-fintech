
import React from "react";
import { Profile } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfileCardProps {
  user: Profile;
  processingAction: string | null;
  onKycAction: (action: "approve" | "reject") => Promise<void>;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  user, 
  processingAction, 
  onKycAction 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg">{user.name || "Not provided"}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">User ID</p>
            <p className="text-sm font-mono bg-gray-100 p-1 rounded">{user.id}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">KYC Status</p>
            <div className="flex items-center">
              <StatusBadge status={user.kyc_status || "not_submitted"} />
              
              {user.kyc_status === "pending" && (
                <div className="flex ml-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onKycAction("approve")}
                    disabled={!!processingAction}
                    className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-400"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {processingAction === "approve" ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onKycAction("reject")}
                    disabled={!!processingAction}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-400"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {processingAction === "reject" ? "Processing..." : "Reject"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
            <p className="text-lg font-bold">₦{(user.wallet_balance || 0).toLocaleString()}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p>{user.phone_number || "Not provided"}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="capitalize">{user.role || "user"}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Joined Date</p>
            <p>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "Unknown"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
