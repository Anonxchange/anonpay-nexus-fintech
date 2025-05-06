
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/services/transactions/types";

interface TransactionsTabProps {
  filteredTransactions: Transaction[];
  searchTerm: string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ filteredTransactions, searchTerm }) => {
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                {searchTerm ? "No transactions match your search" : "No transactions found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTab;
