
import React from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import { GiftCardSubmission } from "@/services/products/types";
import { formatDistanceToNow } from "date-fns";

interface SubmissionsTableProps {
  submissions: GiftCardSubmission[];
  processingSubmission: string | null;
  onSubmissionAction: (id: string, action: "approve" | "reject") => Promise<void>;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  processingSubmission,
  onSubmissionAction,
}) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"; // Changed from "success" to "default" to match BadgeProps
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const completedSubmissions = submissions.filter((s) => s.status !== "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Card Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSubmissions.length > 0 && (
          <>
            <h3 className="font-medium mb-4">Pending Submissions ({pendingSubmissions.length})</h3>
            <div className="rounded-md border mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Card Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.user_name || "User"}
                      </TableCell>
                      <TableCell>{submission.card_name}</TableCell>
                      <TableCell className="text-right">
                        {submission.amount} {submission.currency}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(submission.created_at), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSubmissionAction(submission.id, "approve")}
                            disabled={processingSubmission === submission.id}
                          >
                            {processingSubmission === submission.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                            onClick={() => onSubmissionAction(submission.id, "reject")}
                            disabled={processingSubmission === submission.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {}} // Will be implemented with view modal
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        <h3 className="font-medium mb-4">Processed Submissions ({completedSubmissions.length})</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Card Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {submission.user_name || "User"}
                  </TableCell>
                  <TableCell>{submission.card_name}</TableCell>
                  <TableCell className="text-right">
                    {submission.amount} {submission.currency}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(
                      new Date(submission.updated_at || submission.created_at),
                      { addSuffix: true }
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(submission.status)}>
                      {submission.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => {}}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {completedSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No processed submissions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsTable;
