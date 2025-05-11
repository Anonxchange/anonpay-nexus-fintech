
import { KycAction } from "@/services/products/types";
import { Profile } from "@/types/auth";

export interface KycTabProps {
  users: Profile[];
  onAction: (userId: string, action: KycAction) => Promise<void>;
}
