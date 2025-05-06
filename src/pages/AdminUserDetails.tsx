import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useUserDetails } from "@/components/admin/user-details/useUserDetails";
import UserProfileCard from "@/components/admin/user-details/UserProfileCard";
import LoadingState from "@/components/admin/user-details/LoadingState";

const AdminUserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, loading, processingAction, handleKycAction } = useUserDetails(userId);

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
        
        {loading ? (
          <LoadingState />
        ) : user ? (
          <div className="space-y-6">
            <UserProfileCard 
              user={user} 
              processingAction={processingAction} 
              onKycAction={handleKycAction} 
            />
            
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
