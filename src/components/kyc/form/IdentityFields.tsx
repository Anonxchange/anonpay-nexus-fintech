
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { KycFormData } from "@/types/kyc";

interface IdentityFieldsProps {
  form: UseFormReturn<KycFormData>;
}

const IdentityFields: React.FC<IdentityFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};

export default IdentityFields;
