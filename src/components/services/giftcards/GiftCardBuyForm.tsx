
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CreditCard } from "lucide-react";
import { GiftCard } from "@/services/products/types";
import { useToast } from "@/hooks/use-toast";

interface GiftCardBuyFormProps {
  user: any;
  availableCards: GiftCard[];
  onComplete: () => void;
}

const formSchema = z.object({
  cardId: z.string().min(1, { message: "Please select a gift card" }),
  amount: z.string().min(1, { message: "Amount is required" }).refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Amount must be a valid number greater than zero"
  }),
  currency: z.string().min(1),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
});

const GiftCardBuyForm: React.FC<GiftCardBuyFormProps> = ({ user, availableCards, onComplete }) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardId: "",
      amount: "",
      currency: "NGN",
      email: user?.email || "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      
      const selectedCard = availableCards.find(card => card.id === values.cardId);
      if (!selectedCard) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Selected gift card not found."
        });
        return;
      }
      
      // This would be replaced with an actual API call in production
      // Simulate API request with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Purchase Successful",
        description: `Your ${selectedCard.name} gift card purchase has been processed.`,
      });
      
      form.reset();
      onComplete();
    } catch (error: any) {
      console.error("Error purchasing gift card:", error);
      toast({
        variant: "destructive",
        title: "Purchase Error",
        description: error.message || "An error occurred while purchasing. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Gift Card</CardTitle>
        <CardDescription>Purchase gift cards instantly</CardDescription>
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
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} ({card.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Email (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter email for code delivery" 
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          By completing this purchase, you agree to our terms and conditions.
        </p>
      </CardFooter>
    </Card>
  );
};

export default GiftCardBuyForm;
