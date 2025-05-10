
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GiftCardSubmission } from "@/services/products/types";
import { formatDistanceToNow } from "date-fns";
import { Eye, Image, AlertCircle } from "lucide-react";

interface GiftCardSubmissionsListProps {
  submissions: GiftCardSubmission[];
  onViewImage: (imageUrl: string) => void;
}

const GiftCardSubmissionsList: React.FC<GiftCardSubmissionsListProps> = ({
  submissions,
  onViewImage,
}) => {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
          <h3 className="font-medium text-gray-900">No submissions yet</h3>
          <p className="text-sm text-gray-500 max-w-md mt-1">
            You haven't submitted any gift cards yet. Select a gift card to sell from the "Sell Gift Card" tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">
                {submission.card_name}
              </CardTitle>
              <Badge variant={getBadgeVariant(submission.status)}>
                {submission.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">
                  {submission.amount} {submission.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submitted:</span>
                <span>
                  {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                </span>
              </div>
              
              {submission.status === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                  <p className="text-sm text-green-700">
                    Your wallet has been credited with the equivalent value in NGN.
                  </p>
                </div>
              )}
              
              {submission.status === "rejected" && submission.admin_notes && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                  <p className="text-sm font-medium text-red-700 mb-1">Reason for rejection:</p>
                  <p className="text-sm text-red-700">{submission.admin_notes}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-gray-500">
                  Card Code: {submission.card_code.slice(0, 4)}...
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewImage(submission.receipt_image_url)}
                  className="flex items-center text-xs"
                >
                  <Image className="h-3.5 w-3.5 mr-1" />
                  View Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GiftCardSubmissionsList;
