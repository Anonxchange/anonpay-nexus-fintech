
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGiftCards, getUserGiftCardSubmissions } from '@/services/products/giftcardService';
import { GiftCard, GiftCardSubmission } from '@/services/products/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GiftCardSellForm from './GiftCardSellForm';
import GiftCardSubmissionsList from './GiftCardSubmissionsList';

interface GiftCardServiceProps {
  user: any;
}

const GiftCardService: React.FC<GiftCardServiceProps> = ({ user }) => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("sell");
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [submissions, setSubmissions] = useState<GiftCardSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cardsData, submissionsData] = await Promise.all([
        getGiftCards(),
        getUserGiftCardSubmissions(user.id)
      ]);
      
      setGiftCards(cardsData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error("Error fetching gift card data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleCompleteSubmission = () => {
    fetchData();
    setActiveTab("history");
  };
  
  const handleViewImage = (url: string) => {
    setImagePreviewUrl(url);
  };
  
  return (
    <div className="space-y-4">
      {!profile?.kyc_status || profile.kyc_status !== "approved" ? (
        <Alert variant="destructive">
          <AlertDescription>
            You need to complete KYC verification before you can sell gift cards.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sell">Sell Gift Card</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sell" className="mt-4">
            <GiftCardSellForm 
              user={user} 
              availableCards={giftCards} 
              onComplete={handleCompleteSubmission} 
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-anonpay-primary"></div>
              </div>
            ) : (
              <GiftCardSubmissionsList 
                submissions={submissions} 
                onViewImage={handleViewImage}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {/* Image preview dialog */}
      <Dialog open={!!imagePreviewUrl} onOpenChange={(open) => !open && setImagePreviewUrl(null)}>
        <DialogContent className="sm:max-w-md">
          {imagePreviewUrl && (
            <img 
              src={imagePreviewUrl} 
              alt="Gift card" 
              className="w-full h-auto rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftCardService;
