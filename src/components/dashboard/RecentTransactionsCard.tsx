
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TransactionHistory from "./TransactionHistory";

interface RecentTransactionsCardProps {
  onViewAllClick: () => void;
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ onViewAllClick }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest activities</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] overflow-auto">
        <TransactionHistory limit={5} showViewAll={false} />
      </CardContent>
      <CardFooter>
        <Link to="/dashboard" className="w-full">
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onViewAllClick}
          >
            View All Transactions
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentTransactionsCard;
