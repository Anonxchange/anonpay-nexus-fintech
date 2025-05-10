
import React from "react";
import { KycTabProps } from "./types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKycActions } from "./useKycActions";
import { User } from "./columns"; // Import the User type from columns

const KycTab: React.FC<KycTabProps> = ({ users, onAction }) => {
  const { processingUser, handleAction, handleViewUser } = useKycActions(onAction);

  // Cast the input users to the User type defined in columns.tsx
  const typedUsers = users.map(user => ({
    id: user.id,
    name: user.name || null,
    email: user.email || "",
    kyc_status: user.kyc_status || "not_submitted",
    created_at: user.created_at || new Date().toISOString()
  })) as User[];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification Requests</CardTitle>
          <CardDescription>
            Review and manage user KYC verification requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns({ 
              onApprove: (userId) => handleAction(userId, "approve"),
              onReject: (userId) => handleAction(userId, "reject"),
              onView: handleViewUser,
              processingUser
            })} 
            data={typedUsers} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KycTab;
