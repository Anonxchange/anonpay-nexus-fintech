
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
    fetchData();
    
    // Set up realtime subscriptions
    const cardsChannel = supabase
      .channel('giftcard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gift_cards' }, 
        () => fetchGiftCards())
      .subscribe();
    
    const submissionsChannel = supabase
      .channel('giftcard_submissions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gift_card_submissions' }, 
        () => fetchSubmissions())
      .subscribe();
    
    return () => { 
      supabase.removeChannel(cardsChannel);
      supabase.removeChannel(submissionsChannel); 
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchGiftCards(), fetchSubmissions()]);
    setLoading(false);
  };

  const fetchGiftCards = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Count submissions for each card
      const { data: submissionCounts, error: submissionError } = await supabase
        .from('gift_card_submissions')
        .select('card_id, count')
        .eq('status', 'pending')
        .group('card_id');
      
      if (submissionError) console.error('Error fetching submission counts:', submissionError);
      
      // Combine data
      const cardsWithCounts = data.map(card => {
        const submissionData = submissionCounts?.find(s => s.card_id === card.id);
        return {
          ...card,
          submissionCount: submissionData ? Number(submissionData.count) : 0
        };
      });
      
      setCards(cardsWithCounts);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load gift card data."
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_card_submissions')
        .select(`
          *,
          profiles:user_id (name),
          gift_cards:card_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match our expected format
      const transformedData: GiftCardSubmission[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        user_name: item.profiles?.name || 'Unknown User',
        card_id: item.card_id,
        card_name: item.gift_cards?.name || 'Unknown Card',
        card_code: item.card_code,
        amount: item.amount,
        status: item.status,
        created_at: item.created_at,
        image_url: item.image_url
      }));
      
      setSubmissions(transformedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load gift card submissions."
      });
    }
  };

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
      const { error } = await supabase
        .from('gift_cards')
        .update({
          buy_rate: editForm.buyRate,
          sell_rate: editForm.sellRate,
          is_active: editForm.isActive
        })
        .eq('id', id);
      
      if (error) throw error;
      
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
      
      const submission = submissions.find(s => s.id === id);
      if (!submission) return;

      // Update submission status
      const { error: updateError } = await supabase
        .from('gift_card_submissions')
        .update({
          status: action === "approve" ? "approved" : "rejected"
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // If approved, credit the user's wallet
      if (action === "approve") {
        const { error: walletError } = await supabase.rpc(
          "update_wallet_balance",
          {
            user_id: submission.user_id,
            amount: submission.amount,
            transaction_type: "gift-card-sale",
            reference: `gift-card-submission:${id}`
          }
        );
        
        if (walletError) throw walletError;
      }
      
      toast({
        title: `Submission ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `Gift card submission has been ${action === "approve" ? "approved and user credited" : "rejected"}.`
      });
      
      await fetchSubmissions(); // Refresh the submissions list
    } catch (error) {
      console.error(`Error in ${action} submission:`, error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: `Failed to ${action} submission. Please try again.`
      });
    } finally {
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
