
import React, { useState } from "react";
import { UsersTabProps } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, User, UserCog, Ban, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const UsersTab: React.FC<UsersTabProps> = ({ users, onUserAction }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleUserAction = (userId: string, action: string) => {
    if (onUserAction) {
      onUserAction(userId, action);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.id && user.id.includes(searchLower)) ||
      (user.role && user.role.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>
            Manage all users and their account statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center pb-4">
            <Input
              placeholder="Search users..."
              className="max-w-sm mr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Wallet Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {user.name || "Not Set"}
                        </div>
                      </TableCell>
                      <TableCell>{user.email || "No Email"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {user.role === "admin" && (
                            <Shield className="h-3 w-3 text-red-500" />
                          )}
                          <span className="capitalize">{user.role || "user"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.kyc_status === "approved"
                              ? "default"
                              : user.kyc_status === "pending"
                              ? "outline"
                              : user.kyc_status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {user.kyc_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.account_status === "active"
                              ? "default"
                              : user.account_status === "suspended"
                              ? "outline"
                              : user.account_status === "blocked"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {user.account_status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ₦{user.wallet_balance?.toLocaleString() || "0.00"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user.id)}
                            title="View User Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <UserCog className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.account_status !== "blocked" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUserAction(user.id, "block")}
                                  className="text-red-500"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Block User
                                </DropdownMenuItem>
                              )}
                              {user.account_status !== "active" && (
                                <DropdownMenuItem 
                                  onClick={() => handleUserAction(user.id, "activate")}
                                  className="text-green-500"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
