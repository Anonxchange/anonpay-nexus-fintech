
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/services/transactions/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteUserTransaction } from "@/services/user/userService";
import { useToast } from "@/hooks/use-toast";

interface TransactionsTabProps {
  filteredTransactions: Transaction[];
  searchTerm: string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ filteredTransactions, searchTerm }) => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;
    
    try {
      setIsDeleting(true);
      
      // Get admin data from local storage
      const adminData = localStorage.getItem("anonpay_admin");
      if (!adminData) {
        throw new Error("Admin data not found");
      }
      
      const admin = JSON.parse(adminData);
      
      const success = await deleteUserTransaction(admin.id, selectedTransaction.id);
      
      if (success) {
        toast({
          title: "Transaction Deleted",
          description: "The transaction has been deleted successfully.",
        });
        setIsDeleteDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: "Failed to delete transaction. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the transaction.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.user_name || "Unknown User"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    transaction.type === 'deposit' ? 'border-green-500 text-green-600' :
                    transaction.type === 'withdrawal' ? 'border-red-500 text-red-600' :
                    'border-blue-500 text-blue-600'
                  }>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-xs truncate max-w-[100px]" title={transaction.reference || ""}>
                  {transaction.reference || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleOpenDeleteDialog(transaction)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                {searchTerm ? "No transactions match your search" : "No transactions found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Delete Transaction
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-2 py-2">
              <div className="grid grid-cols-2">
                <p className="text-sm font-medium">Type:</p>
                <p className="text-sm">{selectedTransaction.type}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-sm font-medium">Amount:</p>
                <p className="text-sm">₦{selectedTransaction.amount.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-sm font-medium">User:</p>
                <p className="text-sm">{selectedTransaction.user_name || "Unknown"}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-sm font-medium">Date:</p>
                <p className="text-sm">{new Date(selectedTransaction.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteTransaction} 
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsTab;
