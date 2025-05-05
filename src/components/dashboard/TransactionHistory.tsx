
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUserTransactions, Transaction } from "@/services/transactions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface TransactionHistoryProps {
  limit?: number;
  showViewAll?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ limit, showViewAll = true }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getUserTransactions(user.id);
        setTransactions(limit ? data.slice(0, limit) : data);
      } catch (error: any) {
        console.error("Failed to fetch transactions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load transaction history"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user, toast, limit]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAmountClass = (amount: number) => {
    return amount >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="flex justify-center items-center p-6">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="flex justify-center items-center p-6 text-muted-foreground">No transactions found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {formatDate(transaction.created_at)}
                </TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell className={getAmountClass(transaction.amount)}>
                  ₦{Math.abs(transaction.amount).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {transaction.reference || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {showViewAll && transactions.length > 0 && (
        <div className="flex justify-center p-2 border-t">
          <button 
            className="text-sm text-primary hover:underline"
            onClick={() => document.querySelector('[value="history"]')?.dispatchEvent(
              new MouseEvent('click', { bubbles: true })
            )}
          >
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
