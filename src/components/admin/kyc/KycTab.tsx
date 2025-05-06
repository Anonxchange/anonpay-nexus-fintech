
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { Profile } from "@/types/auth";

interface KycTabProps {
  filteredUsers: Profile[];
  handleKycAction: (userId: string, action: "approve" | "reject") => Promise<void>;
}

const KycTab: React.FC<KycTabProps> = ({ filteredUsers, handleKycAction }) => {
  const pendingUsers = filteredUsers.filter(
    (user) => user.kyc_status === "pending" || user.kyc_status === "rejected"
  );

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
                      onClick={() => handleKycAction(user.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKycAction(user.id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No pending KYC submissions
        </div>
      )}
    </div>
  );
};

export default KycTab;
