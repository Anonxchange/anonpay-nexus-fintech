
import React from "react";
import { GiftCardSubmission } from "@/services/products/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GiftCardSubmissionsListProps {
  submissions: GiftCardSubmission[];
  onViewImage: (url: string) => void;
}

const GiftCardSubmissionsList: React.FC<GiftCardSubmissionsListProps> = ({
  submissions,
  onViewImage,
}) => {
  // Sort submissions by created_at, newest first
  const sortedSubmissions = [...submissions].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Gift Card Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedSubmissions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            You haven't submitted any gift cards yet.
          </p>
        ) : (
          <div className="space-y-4">
            {sortedSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="border rounded-md p-4 bg-card"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {submission.card_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Submitted{" "}
                      {formatDistanceToNow(new Date(submission.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex flex-col gap-1 text-sm">
                      <p>
                        <span className="font-medium">Amount:</span>{" "}
                        {submission.currency} {submission.amount.toLocaleString()}
                      </p>
                      {submission.card_code && (
                        <p>
                          <span className="font-medium">Card Code:</span>{" "}
                          {submission.card_code}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getSubmissionStatusBadge(submission.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewImage(submission.receipt_image_url)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View Receipt
                    </Button>
                  </div>
                </div>

                {submission.status === "rejected" && submission.admin_notes && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    <p className="font-medium">Rejection reason:</p>
                    <p>{submission.admin_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftCardSubmissionsList;
