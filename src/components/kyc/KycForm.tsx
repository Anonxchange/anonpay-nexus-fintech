
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth, User } from "../../App";

// Define schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const kycSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  dob: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => {
    const today = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
    return date <= eighteenYearsAgo;
  }, "You must be at least 18 years old"),
});

type KycFormValues = z.infer<typeof kycSchema>;

interface KycFormProps {
  user: User;
  onSubmit?: (data: any) => Promise<void>;
}

const KycForm: React.FC<KycFormProps> = ({ user, onSubmit }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: "",
      dob: undefined,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 5MB",
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only JPEG, PNG and WebP formats are supported",
      });
      return;
    }

    setFile(file);
  };

  const handleSubmitForm = async (data: KycFormValues) => {
    if (!idFile || !selfieFile) {
      toast({
        variant: "destructive",
        title: "Missing files",
        description: "Please upload both ID and selfie",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // In a real app, you would upload files and submit data to server
      // For demo purposes, simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "KYC submitted successfully",
        description: "Your identity will be verified soon.",
      });
      
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If KYC is already submitted
  if (user.kycStatus === "pending") {
    return (
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-lg font-medium mb-2">KYC Verification in Progress</h3>
        <p className="text-gray-600 mb-4">
          Your KYC documents have been submitted and are currently being reviewed by our team.
          This process typically takes 24-48 hours.
        </p>
        <p className="text-sm text-gray-500">
          Submitted on {new Date().toLocaleDateString()}
        </p>
      </div>
    );
  }

  // If KYC is rejected
  if (user.kycStatus === "rejected") {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">KYC Verification Failed</h3>
          <p className="text-gray-700 mb-4">
            Your KYC verification was rejected. Please resubmit with the following corrections:
          </p>
          <ul className="list-disc pl-5 text-gray-700 mb-4">
            <li>Ensure your ID document is clearly visible and not expired</li>
            <li>Make sure your selfie is clear and your face is fully visible</li>
            <li>The name on your ID must match the name you provided</li>
          </ul>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
            {/* Form fields here (same as below) */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your legal full name" {...field} />
                  </FormControl>
                  <FormDescription>
                    As it appears on your government ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dob"
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
                          const eighteenYearsAgo = new Date();
                          eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
                          return date > eighteenYearsAgo || date < new Date("1900-01-01");
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    You must be at least 18 years old
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <div>
                <FormLabel htmlFor="id-document">Government ID</FormLabel>
                <div className="mt-1">
                  <label
                    htmlFor="id-document"
                    className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 ${
                      idFile ? "border-green-400" : "border-gray-300"
                    } border-dashed rounded-md appearance-none cursor-pointer hover:border-anonpay-primary focus:outline-none`}
                  >
                    <span className="flex flex-col items-center justify-center pt-5">
                      {idFile ? (
                        <>
                          <Upload className="w-8 h-8 text-green-500" />
                          <span className="text-xs font-medium text-green-600 mt-2">
                            {idFile.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-xs font-medium text-gray-600 mt-2">
                            Upload your ID (passport, driver's license, etc.)
                          </span>
                        </>
                      )}
                    </span>
                    <input
                      id="id-document"
                      name="id-document"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setIdFile)}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG or WebP, max 5MB
                </p>
              </div>
              
              <div>
                <FormLabel htmlFor="selfie">Selfie with ID</FormLabel>
                <div className="mt-1">
                  <label
                    htmlFor="selfie"
                    className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 ${
                      selfieFile ? "border-green-400" : "border-gray-300"
                    } border-dashed rounded-md appearance-none cursor-pointer hover:border-anonpay-primary focus:outline-none`}
                  >
                    <span className="flex flex-col items-center justify-center pt-5">
                      {selfieFile ? (
                        <>
                          <Upload className="w-8 h-8 text-green-500" />
                          <span className="text-xs font-medium text-green-600 mt-2">
                            {selfieFile.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-xs font-medium text-gray-600 mt-2">
                            Upload a selfie of you holding your ID
                          </span>
                        </>
                      )}
                    </span>
                    <input
                      id="selfie"
                      name="selfie"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setSelfieFile)}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG or WebP, max 5MB
                </p>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Resubmit KYC"
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  }
  
  // For new submissions
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your legal full name" {...field} />
              </FormControl>
              <FormDescription>
                As it appears on your government ID
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dob"
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
                      const eighteenYearsAgo = new Date();
                      eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
                      return date > eighteenYearsAgo || date < new Date("1900-01-01");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                You must be at least 18 years old
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="id-document">Government ID</FormLabel>
            <div className="mt-1">
              <label
                htmlFor="id-document"
                className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 ${
                  idFile ? "border-green-400" : "border-gray-300"
                } border-dashed rounded-md appearance-none cursor-pointer hover:border-anonpay-primary focus:outline-none`}
              >
                <span className="flex flex-col items-center justify-center pt-5">
                  {idFile ? (
                    <>
                      <Upload className="w-8 h-8 text-green-500" />
                      <span className="text-xs font-medium text-green-600 mt-2">
                        {idFile.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600 mt-2">
                        Upload your ID (passport, driver's license, etc.)
                      </span>
                    </>
                  )}
                </span>
                <input
                  id="id-document"
                  name="id-document"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setIdFile)}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or WebP, max 5MB
            </p>
          </div>
          
          <div>
            <FormLabel htmlFor="selfie">Selfie with ID</FormLabel>
            <div className="mt-1">
              <label
                htmlFor="selfie"
                className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 ${
                  selfieFile ? "border-green-400" : "border-gray-300"
                } border-dashed rounded-md appearance-none cursor-pointer hover:border-anonpay-primary focus:outline-none`}
              >
                <span className="flex flex-col items-center justify-center pt-5">
                  {selfieFile ? (
                    <>
                      <Upload className="w-8 h-8 text-green-500" />
                      <span className="text-xs font-medium text-green-600 mt-2">
                        {selfieFile.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-xs font-medium text-gray-600 mt-2">
                        Upload a selfie of you holding your ID
                      </span>
                    </>
                  )}
                </span>
                <input
                  id="selfie"
                  name="selfie"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setSelfieFile)}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or WebP, max 5MB
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit KYC"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default KycForm;
