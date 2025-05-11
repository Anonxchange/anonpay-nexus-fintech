import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GiftCard } from "@/services/products/types";
import { submitGiftCard } from "@/services/products/giftcardService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GiftCardSellFormProps {
  user: any;
  availableCards: GiftCard[];
  onComplete: () => void;
}

const formSchema = z.object({
  cardId: z.string().min(1, { message: "Please select a gift card" }),
  cardCode: z.string().min(5, { message: "Card code is required" }),
  amount: z.string().min(1, { message: "Amount is required" }).refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Amount must be a valid number greater than zero"
  }),
  currency: z.string().min(1),
  receiptImage: z.any(),
  comments: z.string().optional(),
});

const GiftCardSellForm: React.FC<GiftCardSellFormProps> = ({ user, availableCards, onComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
      cardCode: "",
      amount: "",
      currency: "NGN",
      receiptImage: null,
      comments: "",
    },
  });
  
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const timestamp = new Date().getTime();
      const filePath = `giftcard-receipts/${user.id}/${timestamp}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Error uploading image:", error);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Failed to upload receipt image. Please try again."
        });
        return;
      }
      
      const publicURL = supabase.storage.from('public').getPublicUrl(filePath);
      setImageUrl(publicURL.data.publicUrl);
      
      toast({
        title: "Upload Successful",
        description: "Receipt image uploaded successfully."
      });
    } catch (error) {
      console.error("Error during image upload:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error uploading the image. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Missing Image",
        description: "Please upload a receipt image."
      });
      return;
    }
    
    try {
      setUploading(true);
      
      const selectedCard = availableCards.find(card => card.id === values.cardId);
      if (!selectedCard) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Selected gift card not found."
        });
        return;
      }
      
      const result = await submitGiftCard(
        user.id,
        values.cardId,
        selectedCard.name,
        values.cardCode,
        Number(values.amount),
        values.currency,
        imageUrl,
        values.comments
      );
      
      if (result.success) {
        toast({
          title: "Submission Successful",
          description: "Your gift card submission has been received."
        });
        form.reset();
        setImageUrl(null);
        onComplete();
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "Failed to submit gift card. Please try again."
        });
      }
    } catch (error: any) {
      console.error("Error submitting gift card:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An error occurred while submitting. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell Gift Card</CardTitle>
        <CardDescription>Submit your gift card details to sell</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gift Card Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gift card" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>{card.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Enter card code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter amount" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NGN">NGN</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="receiptImage"
              render={() => (
                <FormItem>
                  <FormLabel>Receipt Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue("receiptImage", file);
                          handleImageUpload(file);
                        }
                      }}
                      disabled={uploading}
                    />
                  </FormControl>
                  <FormDescription>Upload a clear image of the gift card receipt.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional comments?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Receipt Preview"
            className="max-w-md rounded-md"
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default GiftCardSellForm;
