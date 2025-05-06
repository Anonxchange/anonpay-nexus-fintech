
import { Profile } from "@/types/auth";

export interface UsersTabProps {
  users: Profile[];
  onUserAction?: (userId: string, action: string) => Promise<void>;
}
