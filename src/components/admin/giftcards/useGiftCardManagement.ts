
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { GiftCardSubmission } from "@/services/products/types";
import { ExtendedGiftCard } from "./types";

export const useGiftCardManagement = () => {
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
        buy_rate: 650,
        sell_rate: 700,
        image_url: "https://example.com/itunes.png",
        is_active: true,
        currency: "USD",
        submissionCount: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "2",
        name: "Amazon Gift Card",
        description: "Amazon.com Gift Card",
        buy_rate: 700,
        sell_rate: 750,
        image_url: "https://example.com/amazon.png",
        is_active: true,
        currency: "USD",
        submissionCount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "3",
        name: "Steam Gift Card",
        description: "Steam Gaming Platform Gift Card",
        buy_rate: 600,
        sell_rate: 650,
        image_url: "https://example.com/steam.png",
        is_active: true,
        currency: "USD",
        submissionCount: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
    
    // Use the properly typed submissions with the correct status type
    const mockSubmissions: GiftCardSubmission[] = [
      {
        id: "1",
        user_id: "user1",
        user_name: "John Doe",
        card_id: "1",
        card_name: "iTunes Gift Card",
        card_code: "ITNS-1234-5678",
        receipt_image_url: "https://example.com/receipt1.jpg",
        amount: 5000,
        currency: "USD",
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
        receipt_image_url: "https://example.com/receipt2.jpg",
        amount: 3500,
        currency: "USD",
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
        receipt_image_url: "https://example.com/receipt3.jpg",
        amount: 7500,
        currency: "USD",
        status: "rejected",
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];
    
    setSubmissions(mockSubmissions);
  }, []);

  const handleEdit = (card: ExtendedGiftCard) => {
    setEditingId(card.id);
    setEditForm({
      buyRate: card.buy_rate,
      sellRate: card.sell_rate,
      isActive: card.is_active
    });
  };

  const handleSave = async (id: string) => {
    try {
      // In real implementation, this would update the database
      const updatedCards = cards.map(card => {
        if (card.id === id) {
          return {
            ...card,
            buy_rate: editForm.buyRate,
            sell_rate: editForm.sellRate,
            is_active: editForm.isActive
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
              status: action === "approve" ? "approved" : "rejected" as "approved" | "rejected"
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

  const getPendingSubmissionsCount = () => {
    return submissions.filter(s => s.status === "pending").length;
  };

  return {
    cards,
    submissions,
    loading,
    activeView,
    editingId,
    editForm,
    processingSubmission,
    setActiveView,
    handleEdit,
    handleSave,
    handleCancel,
    handleSubmissionAction,
    setEditForm,
    getPendingSubmissionsCount,
  };
};
