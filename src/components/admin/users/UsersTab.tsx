
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { Profile } from "@/types/auth";

interface UsersTabProps {
  filteredUsers: Profile[];
  searchTerm: string;
}

const UsersTab: React.FC<UsersTabProps> = ({ filteredUsers, searchTerm }) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>KYC Status</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                <TableCell>
                  <StatusBadge status={user.kyc_status || "not_submitted"} />
                </TableCell>
                <TableCell>₦{(user.wallet_balance || 0).toLocaleString()}</TableCell>
                <TableCell>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                {searchTerm ? "No users match your search" : "No users found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTab;
