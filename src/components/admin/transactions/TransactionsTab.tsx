
import React, { useState } from "react";
import { TransactionsTabProps } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    const searchString = searchTerm.toLowerCase();
    return (
      transaction.reference?.toLowerCase().includes(searchString) ||
      transaction.type.toLowerCase().includes(searchString) ||
      transaction.status.toLowerCase().includes(searchString) ||
      transaction.user_name?.toLowerCase().includes(searchString) ||
      transaction.amount.toString().includes(searchString)
    );
  });

  // Function to get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "default"; // Changed from "success" to "default"
      case "pending":
        return "outline"; // Changed from "warning" to "outline"
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Function to view transaction details
  const viewTransactionDetails = (transactionId: string) => {
    // Navigate to transaction details page or show modal
    console.log("View transaction:", transactionId);
  };

  // Function to export transactions as CSV
  const exportTransactions = () => {
    // Implementation for exporting transactions
    console.log("Export transactions");
  };

  // Function to view user profile
  const viewUserProfile = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={exportTransactions}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.reference || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => viewUserProfile(transaction.user_id)}
                    >
                      {transaction.user_name || "Unknown User"}
                    </Button>
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.type}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(transaction.amount, "NGN")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(transaction.created_at),
                      "MMM dd, yyyy HH:mm"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewTransactionDetails(transaction.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTab;
