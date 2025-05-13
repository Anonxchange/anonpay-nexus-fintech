
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { KycFormData } from "@/types/kyc";
import { formSchema } from "./form/formSchema";
import PersonalInfoFields from "./form/PersonalInfoFields";
import IdentityFields from "./form/IdentityFields";
import DocumentUpload from "./form/DocumentUpload";
import { useKycFormSubmission } from "./form/useKycFormSubmission";

interface KycFormProps {
  onComplete: () => void;
}

const KycForm: React.FC<KycFormProps> = ({ onComplete }) => {
  const {
    uploading,
    handleDocumentChange,
    handleSelfieChange,
    onSubmit
  } = useKycFormSubmission(onComplete);

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

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PersonalInfoFields form={form} />
            <IdentityFields form={form} />
            <DocumentUpload 
              onDocumentChange={handleDocumentChange}
              onSelfieChange={handleSelfieChange}
              uploading={uploading}
            />

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
