
import { KycAction } from "@/services/products/types";
import { User } from "./columns";

export interface KycTabProps {
  users: User[];
  onAction: (userId: string, action: KycAction) => Promise<void>;
}
