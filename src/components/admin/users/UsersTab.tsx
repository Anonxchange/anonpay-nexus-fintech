
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { Profile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateUserWalletBalance } from "@/services/user/userService";
import { useToast } from "@/hooks/use-toast";

interface UsersTabProps {
  filteredUsers: Profile[];
  searchTerm: string;
}

const UsersTab: React.FC<UsersTabProps> = ({ filteredUsers, searchTerm }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleOpenBalanceDialog = (user: Profile) => {
    setSelectedUser(user);
    setNewBalance(user.wallet_balance || 0);
    setIsBalanceDialogOpen(true);
  };

  const handleUpdateBalance = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      
      // Get admin data from local storage
      const adminData = localStorage.getItem("anonpay_admin");
      if (!adminData) {
        throw new Error("Admin data not found");
      }
      
      const admin = JSON.parse(adminData);
      
      const success = await updateUserWalletBalance(admin.id, selectedUser.id, newBalance);
      
      if (success) {
        toast({
          title: "Balance Updated",
          description: `${selectedUser.name || "User"}'s balance has been updated successfully.`,
        });
        setIsBalanceDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update user's balance. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating the balance.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>KYC Status</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
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
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenBalanceDialog(user)}
                    >
                      <CreditCard className="h-4 w-4 mr-1" /> Balance
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                {searchTerm ? "No users match your search" : "No users found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isBalanceDialogOpen} onOpenChange={setIsBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Balance</DialogTitle>
            <DialogDescription>
              Update the wallet balance for {selectedUser?.name || "this user"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-balance" className="text-right">
                Current Balance
              </Label>
              <div className="col-span-3">
                <p className="text-sm font-medium">
                  ₦{(selectedUser?.wallet_balance || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-balance" className="text-right">
                New Balance
              </Label>
              <div className="col-span-3">
                <Input 
                  id="new-balance"
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBalanceDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdateBalance} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Balance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
