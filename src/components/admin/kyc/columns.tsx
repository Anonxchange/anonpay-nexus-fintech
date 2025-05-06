
import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Profile } from "@/types/auth";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface ColumnsProps {
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onView: (userId: string) => void;
  processingUser: string | null;
}

export const columns = ({
  onApprove,
  onReject,
  onView,
  processingUser,
}: ColumnsProps): ColumnDef<Profile>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name || "Unknown"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.email || "N/A"}</div>,
  },
  {
    accessorKey: "kyc_status",
    header: "KYC Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.kyc_status || "not_submitted"} />
    ),
  },
  {
    accessorKey: "created_at",
    header: "Submission Date",
    cell: ({ row }) => (
      <div>
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userId = row.original.id;
      const isProcessing = processingUser === userId;
      const status = row.original.kyc_status;

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(userId)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          {status === "pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(userId)}
                disabled={isProcessing}
                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-400"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {isProcessing ? "..." : "Approve"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(userId)}
                disabled={isProcessing}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-400"
              >
                <XCircle className="h-4 w-4 mr-1" />
                {isProcessing ? "..." : "Reject"}
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
