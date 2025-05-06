
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { SubmissionsTableProps } from "./types";

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  processingSubmission,
  onSubmissionAction,
}) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">No gift card submissions found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Card</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell>{submission.user_name}</TableCell>
            <TableCell>{submission.card_name}</TableCell>
            <TableCell>₦{submission.amount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge className={
                submission.status === "approved" ? "bg-green-100 text-green-800" : 
                submission.status === "rejected" ? "bg-red-100 text-red-800" : 
                "bg-amber-100 text-amber-800"
              }>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {submission.status === "pending" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSubmissionAction(submission.id, "approve")}
                      disabled={processingSubmission === submission.id}
                      className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-400"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {processingSubmission === submission.id ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSubmissionAction(submission.id, "reject")}
                      disabled={processingSubmission === submission.id}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-400"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {processingSubmission === submission.id ? "Processing..." : "Reject"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    {submission.status === "approved" ? 
                      <CheckCircle className="h-4 w-4 mr-1" /> : 
                      <AlertCircle className="h-4 w-4 mr-1" />
                    }
                    {submission.status === "approved" ? "Approved" : "Rejected"}
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubmissionsTable;
