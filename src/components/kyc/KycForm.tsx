
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { User } from '@supabase/supabase-js';

const kycFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  idType: z.enum(["national_id", "passport", "drivers_license"], {
    required_error: "You need to select an ID type.",
  }),
  idNumber: z.string().min(5, {
    message: "ID number must be at least 5 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

interface KycFormProps {
  user?: User;
  onSubmit?: (data: KycFormValues) => Promise<void>;
  onComplete?: () => void; // Add the missing onComplete prop
}

const KycForm: React.FC<KycFormProps> = ({ user: propUser, onSubmit: propOnSubmit, onComplete }) => {
  const { user: authUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the user from props if provided, otherwise use from auth context
  const activeUser = propUser || authUser;

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: "",
      idType: "national_id",
      idNumber: "",
      address: "",
      phone: "",
    },
  });

  async function handleSubmit(data: KycFormValues) {
    if (!activeUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit your KYC",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // If a custom onSubmit handler was provided, use that
      if (propOnSubmit) {
        await propOnSubmit(data);
        // Call onComplete if provided
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      // Otherwise use the default implementation
      // Update the user's profile with KYC information
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.fullName,
          phone_number: data.phone,
          kyc_status: 'pending'
        })
        .eq('id', activeUser.id);

      if (error) {
        throw error;
      }

      toast({
        title: "KYC Submitted",
        description: "Your KYC information has been submitted successfully and is under review.",
        variant: "default",
      });

      // Call onComplete if provided
      if (onComplete) {
        onComplete();
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("KYC submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit KYC information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Know Your Customer (KYC)</CardTitle>
        <CardDescription>
          Complete your KYC verification to unlock all features of the platform.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>ID Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="national_id" id="national_id" />
                        <Label htmlFor="national_id">National ID</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passport" id="passport" />
                        <Label htmlFor="passport">Passport</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="drivers_license"
                          id="drivers_license"
                        />
                        <Label htmlFor="drivers_license">Driver's License</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your residential address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormDescription>
              Your information will be securely stored and used only for verification purposes.
            </FormDescription>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit KYC"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default KycForm;
