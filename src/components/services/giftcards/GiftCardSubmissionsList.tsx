
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface Submission {
  id: string;
  cardId: string;
  cardName: string;
  amount: number;
  originalAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  imageUrl?: string;
}

interface GiftCardSubmissionsListProps {
  submissions: Submission[];
  onViewImage: (imageUrl: string) => void;
}

const GiftCardSubmissionsList: React.FC<GiftCardSubmissionsListProps> = ({ submissions, onViewImage }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">You haven't submitted any gift cards yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Card</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Image</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium">{submission.cardName}</TableCell>
            <TableCell>
              <div>
                <div>₦{submission.amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">
                  {submission.originalAmount} {submission.currency}
                </div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(submission.status)}</TableCell>
            <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              {submission.imageUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewImage(submission.imageUrl || '')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GiftCardSubmissionsList;
