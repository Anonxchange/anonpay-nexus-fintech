
import { GiftCard, GiftCardSubmission } from "@/services/products/types";

export interface ExtendedGiftCard extends GiftCard {
  submissionCount?: number;
}

export interface GiftCardTableProps {
  cards: ExtendedGiftCard[];
  editingId: string | null;
  editForm: {
    buyRate: number;
    sellRate: number;
    isActive: boolean;
  };
  onEdit: (card: GiftCard) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  setEditForm: (form: {
    buyRate: number;
    sellRate: number;
    isActive: boolean;
  }) => void;
}

export interface SubmissionsTableProps {
  submissions: GiftCardSubmission[];
  processingSubmission: string | null;
  onSubmissionAction: (id: string, action: "approve" | "reject") => Promise<void>;
}

export interface ViewToggleProps {
  activeView: "cards" | "submissions";
  setActiveView: (view: "cards" | "submissions") => void;
  pendingCount: number;
}
