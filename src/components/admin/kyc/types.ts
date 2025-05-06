
import { Profile } from "@/types/auth";
import { KycAction } from "@/services/products/types";

export interface KycTabProps {
  users: Profile[];
  onAction: (userId: string, action: KycAction) => Promise<void>;
}
