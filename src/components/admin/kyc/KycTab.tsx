
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { Profile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useKycActions } from "./useKycActions";

interface KycTabProps {
  filteredUsers: Profile[];
  handleKycAction: (userId: string, action: "approve" | "reject") => Promise<void>;
}

const KycTab: React.FC<KycTabProps> = ({ filteredUsers, handleKycAction }) => {
  const pendingUsers = filteredUsers.filter(
    (user) => user.kyc_status === "pending"
  );
  
  const { processingUser, handleAction, handleViewUser } = useKycActions(handleKycAction);

  return (
    <div className="space-y-4">
      {pendingUsers.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                <TableCell>
                  <StatusBadge status={user.kyc_status || "not_submitted"} />
                </TableCell>
                <TableCell>
                  {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "Unknown"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUser(user.id)}
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-400"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(user.id, "approve")}
                      disabled={processingUser === user.id}
                      className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-400"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {processingUser === user.id ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(user.id, "reject")}
                      disabled={processingUser === user.id}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-400"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      {processingUser === user.id ? "Processing..." : "Reject"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg border">
          <p className="text-gray-500">No pending KYC submissions to review</p>
        </div>
      )}
    </div>
  );
};

export default KycTab;
