import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Eye } from "lucide-react";

export interface User {
  id: string;
  name: string | null;
  email: string; // Required in User type
  kyc_status?: string;
  created_at?: string;
}

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
}: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return <div className="font-medium">{value || "N/A"}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "kyc_status",
    header: "KYC Status",
    cell: ({ row }) => {
      const value = row.getValue("kyc_status") as string;
      let badgeVariant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | null
        | undefined;
      
      switch (value?.toLowerCase()) {
        case "approved":
          badgeVariant = "default";
          break;
        case "pending":
          badgeVariant = "secondary";
          break;
        case "rejected":
          badgeVariant = "destructive";
          break;
        default:
          badgeVariant = "outline";
      }
      
      return (
        <Badge variant={badgeVariant}>
          {value?.toUpperCase() || "NOT SUBMITTED"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      const value = row.getValue("created_at") as string;
      const date = new Date(value);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const isPending = user.kyc_status?.toLowerCase() === "pending";
      const isCurrentlyProcessing = processingUser === user.id;
      
      return (
        <div className="flex justify-end gap-2">
          {isPending && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(user.id)}
                disabled={isCurrentlyProcessing}
              >
                {isCurrentlyProcessing ? (
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
                onClick={() => onReject(user.id)}
                disabled={isCurrentlyProcessing}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => onView(user.id)}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
