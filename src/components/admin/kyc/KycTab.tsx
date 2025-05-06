import React from "react";
import { KycTabProps } from "./types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKycActions } from "./useKycActions";

const KycTab: React.FC<KycTabProps> = ({ users, onAction }) => {
  const { processingUser, handleAction, handleViewUser } = useKycActions(onAction);

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
            data={users} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KycTab;
