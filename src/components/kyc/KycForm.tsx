import React, { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KycFormData } from "@/types/kyc";
import FileUpload from "../common/FileUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const kycFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }).refine(date => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, {
    message: "You must be at least 18 years old.",
  }),
  idType: z.enum(["national_id", "passport", "drivers_license", "voters_card", "bvn"], {
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
  documentUrl: z.string().optional(),
  selfieUrl: z.string().optional(),
});

type FormValues = z.infer<typeof kycFormSchema>;

interface KycFormProps {
  user?: User;
  onSubmit?: (data: KycFormData) => Promise<void>;
  onComplete?: () => void;
}

const KycForm: React.FC<KycFormProps> = ({ user: propUser, onSubmit: propOnSubmit, onComplete }) => {
  const { user: authUser, profile, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [selfieUploading, setSelfieUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the user from props if provided, otherwise use from auth context
  const activeUser = propUser || authUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: profile?.name || "",
      idType: "national_id",
      idNumber: "",
      address: "",
      phone: profile?.phone_number || "",
    },
  });

  async function handleSubmit(data: FormValues) {
    if (!activeUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit your KYC",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!documentFile) {
      toast({
        title: "Document Required",
        description: "Please upload your identification document",
        variant: "destructive",
      });
      return;
    }

    if (!selfieFile) {
      toast({
        title: "Selfie Required",
        description: "Please upload your selfie for verification",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for submission
      const formattedData: KycFormData = {
        fullName: data.fullName,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        idType: data.idType,
        idNumber: data.idNumber,
        address: data.address,
        phone: data.phone,
        documentUrl: documentFile,
        selfieUrl: selfieFile,
      };

      // If a custom onSubmit handler was provided, use that
      if (propOnSubmit) {
        await propOnSubmit(formattedData);
        // Call onComplete if provided
        if (onComplete) {
          onComplete();
        }
        return;
      }
      
      // Otherwise use the default implementation
      // Create KYC submission
      const { error: submissionError } = await supabase
        .from('kyc_submissions')
        .insert({
          user_id: activeUser.id,
          full_name: data.fullName,
          date_of_birth: format(data.dateOfBirth, "yyyy-MM-dd"),
          address: data.address,
          phone_number: data.phone,
          id_type: data.idType,
          id_number: data.idNumber,
          document_url: documentFile,
          selfie_url: selfieFile,
          status: 'pending'
        });

      if (submissionError) {
        throw submissionError;
      }

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

      // Refresh profile data
      if (refreshProfile) {
        await refreshProfile();
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

  const handleDocumentUpload = async (file: File) => {
    setDocumentUploading(true);
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Document file must be less than 5MB",
        variant: "destructive",
      });
      setDocumentUploading(false);
      return;
    }

    try {
      if (!activeUser) throw new Error("User not authenticated");
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeUser.id}/documents/${Date.now()}.${fileExt}`;
      
      // Check if storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const kycBucket = buckets?.find(bucket => bucket.name === 'kyc');
      
      if (!kycBucket) {
        // Create bucket if it doesn't exist
        const { data, error } = await supabase.storage.createBucket('kyc', {
          public: false,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        });
        
        if (error) throw error;
      }
      
      const { data, error } = await supabase.storage
        .from('kyc')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL (or signed URL for private files)
      const { data: { publicUrl } } = supabase.storage
        .from('kyc')
        .getPublicUrl(fileName);

      setDocumentFile(publicUrl);
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
    } catch (error: any) {
      console.error("Document upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDocumentUploading(false);
    }
  };

  const handleSelfieUpload = async (file: File) => {
    setSelfieUploading(true);
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Selfie file must be less than 5MB",
        variant: "destructive",
      });
      setSelfieUploading(false);
      return;
    }

    try {
      if (!activeUser) throw new Error("User not authenticated");
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeUser.id}/selfies/${Date.now()}.${fileExt}`;
      
      // Check if storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const kycBucket = buckets?.find(bucket => bucket.name === 'kyc');
      
      if (!kycBucket) {
        // Create bucket if it doesn't exist
        const { data, error } = await supabase.storage.createBucket('kyc', {
          public: false,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });
        
        if (error) throw error;
      }
      
      const { data, error } = await supabase.storage
        .from('kyc')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL (or signed URL for private files)
      const { data: { publicUrl } } = supabase.storage
        .from('kyc')
        .getPublicUrl(fileName);

      setSelfieFile(publicUrl);
      toast({
        title: "Selfie uploaded",
        description: "Your selfie has been uploaded successfully",
      });
    } catch (error: any) {
      console.error("Selfie upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload selfie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelfieUploading(false);
    }
  };

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
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const today = new Date();
                          const minDate = new Date();
                          minDate.setFullYear(today.getFullYear() - 100); // 100 years ago
                          return date > today || date < minDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    You must be at least 18 years old to use our services.
                  </FormDescription>
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
                        <RadioGroupItem value="drivers_license" id="drivers_license" />
                        <Label htmlFor="drivers_license">Driver's License</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="voters_card" id="voters_card" />
                        <Label htmlFor="voters_card">Voter's Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bvn" id="bvn" />
                        <Label htmlFor="bvn">BVN</Label>
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

            <div className="space-y-2">
              <Label>ID Document</Label>
              <FileUpload 
                onFileSelect={handleDocumentUpload} 
                isUploading={documentUploading}
                acceptedFileTypes="image/png, image/jpeg, application/pdf"
                maxSize={MAX_FILE_SIZE}
                fileUrl={documentFile}
              />
              {documentFile && (
                <p className="text-sm text-green-600">Document uploaded successfully</p>
              )}
              <FormDescription>
                Upload a clear image of your ID document (PNG, JPG, or PDF, max 5MB).
              </FormDescription>
            </div>

            <div className="space-y-2">
              <Label>Selfie with ID</Label>
              <FileUpload 
                onFileSelect={handleSelfieUpload} 
                isUploading={selfieUploading}
                acceptedFileTypes="image/png, image/jpeg"
                maxSize={MAX_FILE_SIZE}
                fileUrl={selfieFile}
              />
              {selfieFile && (
                <p className="text-sm text-green-600">Selfie uploaded successfully</p>
              )}
              <FormDescription>
                Upload a clear selfie of yourself holding your ID document (PNG or JPG, max 5MB).
              </FormDescription>
            </div>

            <Alert>
              <AlertDescription>
                Your information will be securely stored and used only for verification purposes as required by financial regulations.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || documentUploading || selfieUploading} 
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Submitting...
                </>
              ) : "Submit KYC"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default KycForm;
