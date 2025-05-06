
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GiftCard } from "@/services/products/types";
import { Upload } from "lucide-react";
import { submitGiftCardForSale } from "@/services/products/giftcardService";

interface GiftCardSellFormProps {
  user: any;
  availableCards: GiftCard[];
  onComplete: () => void;
}

const GiftCardSellForm: React.FC<GiftCardSellFormProps> = ({ user, availableCards, onComplete }) => {
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [cardCode, setCardCode] = useState<string>("");
  const [cardAmount, setCardAmount] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 5MB"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file"
      });
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!selectedCard) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a gift card type"
      });
      return false;
    }

    if (!cardCode || cardCode.trim().length < 5) {
      toast({
        variant: "destructive",
        title: "Invalid card code",
        description: "Please enter a valid gift card code"
      });
      return false;
    }

    if (!cardAmount || parseFloat(cardAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount"
      });
      return false;
    }

    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Missing image",
        description: "Please upload an image of the gift card"
      });
      return false;
    }

    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Get card details
      const card = availableCards.find(c => c.id === selectedCard);
      if (!card) throw new Error("Selected card not found");
      
      // Calculate the amount in local currency based on the sell rate
      const amountValue = parseFloat(cardAmount);
      const localAmount = amountValue * card.sellRate;
      
      // Use the mocked function instead of directly calling Supabase
      const success = await submitGiftCardForSale(
        user.id,
        selectedCard,
        cardCode,
        localAmount,
        amountValue,
        card.currency || 'USD',
        additionalInfo,
        imageFile
      );
      
      if (success) {
        toast({
          title: "Gift card submitted",
          description: "Your gift card has been submitted for review"
        });
        
        // Reset form and notify parent
        setSelectedCard("");
        setCardCode("");
        setCardAmount("");
        setAdditionalInfo("");
        setImageFile(null);
        setImagePreview(null);
        onComplete();
      } else {
        throw new Error("Failed to submit gift card");
      }
      
    } catch (error: any) {
      console.error("Error submitting gift card:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Failed to submit gift card. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell Gift Card</CardTitle>
        <CardDescription>Submit your gift card for review and get credited to your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="card-type">Gift Card Type</Label>
            <Select value={selectedCard} onValueChange={handleCardSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select gift card type" />
              </SelectTrigger>
              <SelectContent>
                {availableCards
                  .filter(card => card.isActive)
                  .map(card => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="card-code">Gift Card Code</Label>
            <Input
              id="card-code"
              placeholder="Enter gift card code"
              value={cardCode}
              onChange={(e) => setCardCode(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="card-amount">Card Amount</Label>
            <Input
              id="card-amount"
              type="number"
              placeholder="0.00"
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
            />
            
            {selectedCard && cardAmount && !isNaN(parseFloat(cardAmount)) && (
              <p className="mt-2 text-sm text-gray-600">
                Estimated value: ₦{(parseFloat(cardAmount) * 
                  (availableCards.find(c => c.id === selectedCard)?.sellRate || 0)).toLocaleString()}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="card-image">Card Image (Required)</Label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6">
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Card preview" className="max-h-40 mx-auto rounded-md" />
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="additional-info">Additional Information (Optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Any additional details we should know"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="h-20"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Gift Card"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        <p>Gift cards will be reviewed by our team and credited to your account once verified.</p>
      </CardFooter>
    </Card>
  );
};

export default GiftCardSellForm;
