
import { z } from "zod";
import { KycFormData } from "@/types/kyc";

// Define the form schema with zod
export const formSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  date_of_birth: z.string().min(2, "Date of birth is required"),
  address: z.string().min(2, "Address is required"),
  id_type: z.enum(["national_id", "passport", "drivers_license"]),
  id_number: z.string().min(2, "ID number is required"),
  phone: z.string().min(2, "Phone number is required"),
});

export type FormValues = z.infer<typeof formSchema>;
