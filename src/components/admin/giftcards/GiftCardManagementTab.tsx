
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Save, X, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GiftCard } from "@/services/products/types";

interface GiftCardSubmission {
  id: string;
  user_id: string;
  user_name: string;
  card_id: string;
  card_name: string;
  card_code: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  image_url?: string;
}

interface ExtendedGiftCard extends GiftCard {
  submissionCount?: number;
}

const GiftCardManagementTab: React.FC = () => {
  const [cards, setCards] = useState<ExtendedGiftCard[]>([]);
  const [submissions, setSubmissions] = useState<GiftCardSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"cards" | "submissions">("cards");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    buyRate: number;
    sellRate: number;
    isActive: boolean;
  }>({ buyRate: 0, sellRate: 0, isActive: true });
  const [processingSubmission, setProcessingSubmission] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // For now, just set dummy data since the tables don't exist in the database
    setLoading(false);
    setCards([
      {
        id: "1",
        name: "iTunes Gift Card",
        description: "Apple iTunes Gift Card",
        buyRate: 650,
        sellRate: 700,
        imageUrl: "https://example.com/itunes.png",
        isActive: true,
        currency: "USD",
        submissionCount: 2
      },
      {
        id: "2",
        name: "Amazon Gift Card",
        description: "Amazon.com Gift Card",
        buyRate: 700,
        sellRate: 750,
        imageUrl: "https://example.com/amazon.png",
        isActive: true,
        currency: "USD",
        submissionCount: 0
      },
      {
        id: "3",
        name: "Steam Gift Card",
        description: "Steam Gaming Platform Gift Card",
        buyRate: 600,
        sellRate: 650,
        imageUrl: "https://example.com/steam.png",
        isActive: true,
        currency: "USD",
        submissionCount: 1
      }
    ]);
    
    setSubmissions([
      {
        id: "1",
        user_id: "user1",
        user_name: "John Doe",
        card_id: "1",
        card_name: "iTunes Gift Card",
        card_code: "ITNS-1234-5678",
        amount: 5000,
        status: "pending",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        user_id: "user2",
        user_name: "Jane Smith",
        card_id: "3",
        card_name: "Steam Gift Card",
        card_code: "STEAM-9876-5432",
        amount: 3500,
        status: "approved",
        created_at: new Date(Date.now() - 86400000).toISOString()  // 1 day ago
      },
      {
        id: "3",
        user_id: "user1",
        user_name: "John Doe",
        card_id: "1",
        card_name: "iTunes Gift Card",
        card_code: "ITNS-8765-4321",
        amount: 7500,
        status: "rejected",
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ]);
  }, []);

  const handleEdit = (card: GiftCard) => {
    setEditingId(card.id);
    setEditForm({
      buyRate: card.buyRate,
      sellRate: card.sellRate,
      isActive: card.isActive
    });
  };

  const handleSave = async (id: string) => {
    try {
      // In real implementation, this would update the database
      const updatedCards = cards.map(card => {
        if (card.id === id) {
          return {
            ...card,
            buyRate: editForm.buyRate,
            sellRate: editForm.sellRate,
            isActive: editForm.isActive
          };
        }
        return card;
      });
      
      setCards(updatedCards);
      
      toast({
        title: "Gift Card Updated",
        description: "The gift card rates have been updated successfully."
      });
      
      setEditingId(null);
    } catch (error) {
      console.error('Error updating gift card:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update gift card."
      });
    }
  };

  const handleSubmissionAction = async (id: string, action: "approve" | "reject") => {
    try {
      setProcessingSubmission(id);
      
      // In real implementation, this would update the database
      setTimeout(() => {
        const updatedSubmissions = submissions.map(submission => {
          if (submission.id === id) {
            return {
              ...submission,
              status: action === "approve" ? "approved" : "rejected"
            };
          }
          return submission;
        });
        
        setSubmissions(updatedSubmissions);
        
        toast({
          title: `Submission ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `Gift card submission has been ${action === "approve" ? "approved and user credited" : "rejected"}.`
        });
        
        setProcessingSubmission(null);
      }, 1000); // Simulate server delay
      
    } catch (error) {
      console.error(`Error in ${action} submission:`, error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: `Failed to ${action} submission. Please try again.`
      });
      setProcessingSubmission(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const renderCardsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Card</TableHead>
          <TableHead>Buy Rate (₦)</TableHead>
          <TableHead>Sell Rate (₦)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.length > 0 ? (
          cards.map((card) => (
            <TableRow key={card.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  {card.imageUrl && (
                    <img 
                      src={card.imageUrl} 
                      alt={card.name} 
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{card.name}</p>
                    <p className="text-sm text-gray-500">{card.description}</p>
                    {card.submissionCount > 0 && (
                      <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200">
                        {card.submissionCount} pending
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {editingId === card.id ? (
                  <Input
                    type="number"
                    value={editForm.buyRate}
                    onChange={(e) => setEditForm({ ...editForm, buyRate: parseFloat(e.target.value) })}
                    className="w-32"
                  />
                ) : (
                  <>₦{card.buyRate.toLocaleString()}</>
                )}
              </TableCell>
              <TableCell>
                {editingId === card.id ? (
                  <Input
                    type="number"
                    value={editForm.sellRate}
                    onChange={(e) => setEditForm({ ...editForm, sellRate: parseFloat(e.target.value) })}
                    className="w-32"
                  />
                ) : (
                  <>₦{card.sellRate.toLocaleString()}</>
                )}
              </TableCell>
              <TableCell>
                {editingId === card.id ? (
                  <select
                    value={editForm.isActive ? "active" : "inactive"}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "active" })}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <Badge className={card.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {card.isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {editingId === card.id ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSave(card.id)}
                      className="text-green-600 border-green-200"
                    >
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancel}
                      className="text-red-600 border-red-200"
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(card)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
              No gift cards found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderSubmissionsTable = () => (
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
        {submissions.length > 0 ? (
          submissions.map((submission) => (
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
              <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {submission.status === "pending" ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmissionAction(submission.id, "approve")}
                        disabled={processingSubmission === submission.id}
                        className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-400"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {processingSubmission === submission.id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmissionAction(submission.id, "reject")}
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
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-gray-500">
              No gift card submissions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={activeView === "cards" ? "default" : "outline"} 
          onClick={() => setActiveView("cards")}
        >
          Gift Cards
        </Button>
        <Button 
          variant={activeView === "submissions" ? "default" : "outline"} 
          onClick={() => setActiveView("submissions")}
        >
          Submissions
          {submissions.filter(s => s.status === "pending").length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {submissions.filter(s => s.status === "pending").length}
            </Badge>
          )}
        </Button>
      </div>

      {activeView === "cards" ? renderCardsTable() : renderSubmissionsTable()}
    </div>
  );
};

export default GiftCardManagementTab;
