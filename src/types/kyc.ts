
export interface KycFormData {
  fullName: string;
  dateOfBirth: string;
  address: string;
  idNumber: string;
  idType: "national_id" | "passport" | "drivers_license" | "voters_card" | "bvn";
  phone: string;
  documentUrl?: string;
  selfieUrl?: string;
}

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
}

export interface KycStatus {
  status: "not_submitted" | "pending" | "approved" | "rejected";
  message?: string;
}
