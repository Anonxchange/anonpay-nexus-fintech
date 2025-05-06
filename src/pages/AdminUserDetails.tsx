import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDetailsByAdmin } from "@/services/user/adminService";
import { updateKycStatus } from "@/services/user/accountService";
import { Profile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "@/components/ui/StatusBadge";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const AdminUserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Get admin data from local storage
        const adminData = localStorage.getItem("anonpay_admin");
        if (!adminData) {
          throw new Error("Admin data not found");
        }
        
        const admin = JSON.parse(adminData);
        
        const userData = await getUserDetailsByAdmin(admin.id, userId);
        if (userData) {
          setUser(userData);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user details.",
          });
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading user details.",
        });
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [userId, toast, navigate]);

  const handleKycAction = async (action: "approve" | "reject") => {
    if (!user) return;
    
    try {
      setProcessingAction(action);
      const status = action === "approve" ? "approved" : "rejected";
      const success = await updateKycStatus(user.id, status);
      
      if (success) {
        setUser({
          ...user,
          kyc_status: status as any,
          updated_at: new Date().toISOString()
        });
        
        toast({
          title: `KYC ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `User KYC has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `Failed to ${action} KYC. Please try again.`,
        });
      }
    } catch (error) {
      console.error(`Error in ${action} KYC:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while ${action === "approve" ? "approving" : "rejecting"} KYC.`,
      });
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
          <span className="ml-2">Loading user details...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Details">
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Panel
        </Button>
        
        {user ? (
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg">{user.name || "Not provided"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm font-mono bg-gray-100 p-1 rounded">{user.id}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">KYC Status</p>
                    <div className="flex items-center">
                      <StatusBadge status={user.kyc_status || "not_submitted"} />
                      
                      {user.kyc_status === "pending" && (
                        <div className="flex ml-4 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleKycAction("approve")}
                            disabled={!!processingAction}
                            className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-400"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {processingAction === "approve" ? "Processing..." : "Approve"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleKycAction("reject")}
                            disabled={!!processingAction}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-400"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {processingAction === "reject" ? "Processing..." : "Reject"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
                    <p className="text-lg font-bold">₦{(user.wallet_balance || 0).toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p>{user.phone_number || "Not provided"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="capitalize">{user.role || "user"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Joined Date</p>
                    <p>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p>{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "Unknown"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional user-specific information can be added here */}
            {/* For example, user's transactions, activity, etc. */}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">User not found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetails;
