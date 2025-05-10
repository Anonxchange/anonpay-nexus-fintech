import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GiftCard } from "@/services/products/types";
import { submitGiftCard } from "@/services/products/giftcardService";
import FileUpload from "../../common/FileUpload";
import { supabase } from "@/integrations/supabase/client";

interface GiftCardSellFormProps {
  user: any;
  availableCards: GiftCard[];
  onComplete: () => void;
}

const formSchema = z.object({
  cardId: z.string({
    required_error: "Please select a gift card type",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  })
  .positive("Amount must be positive")
  .min(5, "Amount must be at least $5"),
  cardCode: z.string().min(5, {
    message: "Card code must be at least 5 characters",
  }),
  comments: z.string().optional(),
});

const GiftCardSellForm: React.FC<GiftCardSellFormProps> = ({ 
  user, 
  availableCards,
  onComplete 
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardImageUploading, setCardImageUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
      amount: 0,
      cardCode: "",
      comments: "",
    },
  });
  
  const handleCardSelect = (cardId: string) => {
    const card = availableCards.find(c => c.id === cardId);
    setSelectedCard(card || null);
    
    // Reset validation errors for amount
    form.trigger("amount");
  };
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!receiptUrl) {
      toast({
        title: "Card Image Required",
        description: "Please upload an image of your gift card or receipt",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await submitGiftCard(
        user.id,
        values.cardId,
        values.amount,
        values.cardCode,
        receiptUrl,
        values.comments
      );
      
      if (response.success) {
        toast({
          title: "Gift Card Submitted",
          description: response.message,
        });
        onComplete();
      } else {
        toast({
          title: "Submission Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting gift card:", error);
      toast({
        title: "Submission Error",
        description: error.message || "An error occurred while submitting your gift card",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCardImageUpload = async (file: File) => {
    setCardImageUploading(true);
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/gift-cards/${Date.now()}.${fileExt}`;
      
      // Check if storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const giftcardBucket = buckets?.find(bucket => bucket.name === 'giftcards');
      
      if (!giftcardBucket) {
        // Create bucket if it doesn't exist
        const { data, error } = await supabase.storage.createBucket('giftcards', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });
        
        if (error) throw error;
      }
      
      const { data, error } = await supabase.storage
        .from('giftcards')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('giftcards')
        .getPublicUrl(fileName);

      setReceiptUrl(publicUrl);
      toast({
        title: "Image uploaded",
        description: "Your gift card image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error("Gift card image upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCardImageUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gift Card Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCardSelect(value);
                    }}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gift card type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedCard && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Card Information</h3>
                <div className="flex items-center gap-4">
                  {selectedCard.image_url && (
                    <img 
                      src={selectedCard.image_url} 
                      alt={selectedCard.name}
                      className="h-12 w-12 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{selectedCard.description}</p>
                    <p className="text-sm font-semibold mt-1">
                      Rate: {selectedCard.buy_rate} NGN per {selectedCard.currency}
                    </p>
                    {selectedCard.min_amount && selectedCard.max_amount && (
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted range: {selectedCard.min_amount} - {selectedCard.max_amount} {selectedCard.currency}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Amount ({selectedCard?.currency || 'USD'})</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Enter amount" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter gift card code/pin" 
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Card Image/Receipt</FormLabel>
              <FileUpload 
                onFileSelect={handleCardImageUpload}
                isUploading={cardImageUploading}
                fileUrl={receiptUrl}
                acceptedFileTypes="image/png, image/jpeg, image/jpg"
                maxSize={10 * 1024 * 1024} // 10MB
              />
              <p className="text-xs text-gray-500">
                Upload a clear image of your gift card or receipt (PNG or JPG, max 10MB)
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional information about the card"
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || cardImageUploading || !receiptUrl}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Gift Card"
              )}
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>
                By submitting, you confirm that this gift card is legally obtained and has not been used.
                Our team will verify your submission and credit your wallet upon approval.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GiftCardSellForm;
