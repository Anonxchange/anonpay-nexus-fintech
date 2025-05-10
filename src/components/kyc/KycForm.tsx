import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { KycFormData } from "@/types/kyc";

interface KycFormProps {
  onComplete: () => void;
}

// Define the form schema with zod
const formSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  date_of_birth: z.string().min(2, "Date of birth is required"),
  address: z.string().min(2, "Address is required"),
  id_type: z.enum(["national_id", "passport", "drivers_license"]),
  id_number: z.string().min(2, "ID number is required"),
  phone: z.string().min(2, "Phone number is required"),
});

const KycForm: React.FC<KycFormProps> = ({ onComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<KycFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      date_of_birth: "",
      address: "",
      id_type: "national_id",
      id_number: "",
      phone: "",
      document_file: null,
      selfie_file: null,
    },
  });

  const onSubmit = async (data: KycFormData) => {
    if (!documentFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload your ID document",
      });
      return;
    }

    if (!selfieFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload your selfie",
      });
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // First, upload the document file
      const documentFileName = `${user.id}_${Date.now()}_document.${
        documentFile.name.split(".").pop()
      }`;
      const { data: documentData, error: documentError } = await supabase.storage
        .from("kyc_documents")
        .upload(documentFileName, documentFile);

      if (documentError) {
        throw new Error(`Document upload failed: ${documentError.message}`);
      }

      // Get the document URL
      const {
        data: { publicUrl: documentUrl },
      } = supabase.storage.from("kyc_documents").getPublicUrl(documentFileName);

      // Then, upload the selfie file
      const selfieFileName = `${user.id}_${Date.now()}_selfie.${
        selfieFile.name.split(".").pop()
      }`;
      const { data: selfieData, error: selfieError } = await supabase.storage
        .from("kyc_documents")
        .upload(selfieFileName, selfieFile);

      if (selfieError) {
        throw new Error(`Selfie upload failed: ${selfieError.message}`);
      }

      // Get the selfie URL
      const {
        data: { publicUrl: selfieUrl },
      } = supabase.storage.from("kyc_documents").getPublicUrl(selfieFileName);

      // Submit KYC data to database
      const { error: submissionError } = await supabase.from("kyc_submissions").insert({
        user_id: user.id,
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        address: data.address,
        id_type: data.id_type,
        id_number: data.id_number,
        phone: data.phone,
        document_type: data.id_type,
        document_url: documentUrl,
        selfie_url: selfieUrl,
        status: "pending"
      });

      if (submissionError) {
        throw new Error(`KYC submission failed: ${submissionError.message}`);
      }

      // Update user profile status
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ kyc_status: "pending" })
        .eq("id", user.id);

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      toast({
        title: "KYC Submitted",
        description:
          "Your verification documents have been submitted successfully.",
      });

      onComplete();
    } catch (error: any) {
      console.error("KYC submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Failed to submit KYC. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelfieFile(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
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
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="YYYY-MM-DD"
                      type="date"
                      {...field}
                    />
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
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ID number" {...field} />
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
                    <Input placeholder="+1-555-555-5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormItem>
                  <FormLabel>ID Document</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleDocumentChange}
                      disabled={uploading}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a clear image or PDF of your ID document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </div>

              <div>
                <FormItem>
                  <FormLabel>Selfie</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieChange}
                      disabled={uploading}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a selfie of yourself holding your ID document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </div>
            </div>

            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default KycForm;
