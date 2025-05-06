
import React from "react";
import GiftCardTable from "./GiftCardTable";
import SubmissionsTable from "./SubmissionsTable";
import ViewToggle from "./ViewToggle";
import { useGiftCardManagement } from "./useGiftCardManagement";

const GiftCardManagementTab: React.FC = () => {
  const {
    cards,
    submissions,
    loading,
    activeView,
    editingId,
    editForm,
    processingSubmission,
    setActiveView,
    handleEdit,
    handleSave,
    handleCancel,
    handleSubmissionAction,
    setEditForm,
    getPendingSubmissionsCount,
  } = useGiftCardManagement();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ViewToggle
        activeView={activeView}
        setActiveView={setActiveView}
        pendingCount={getPendingSubmissionsCount()}
      />

      {activeView === "cards" ? (
        <GiftCardTable
          cards={cards}
          editingId={editingId}
          editForm={editForm}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          setEditForm={setEditForm}
        />
      ) : (
        <SubmissionsTable
          submissions={submissions}
          processingSubmission={processingSubmission}
          onSubmissionAction={handleSubmissionAction}
        />
      )}
    </div>
  );
};

export default GiftCardManagementTab;
