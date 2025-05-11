
export interface KycSubmission {
  id: string;
  user_id: string;
  full_name: string; 
  date_of_birth: string;
  address: string;
  id_number: string;
  id_type: string;
  phone: string;
  document_url: string;
  selfie_url: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  document_type?: string; // Added for backward compatibility
}

export interface KycFormData {
  full_name: string;
  date_of_birth: string;
  address: string;
  id_type: string;
  id_number: string;
  phone: string;
  document_file: File | null;
  selfie_file: File | null;
}
