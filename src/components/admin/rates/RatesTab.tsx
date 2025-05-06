
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRatesManagement } from "./useRatesManagement";
import RateRow from "./RateRow";

const RatesTab: React.FC = () => {
  const {
    rates,
    loading,
    editingId,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleFormChange
  } = useRatesManagement();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency</TableHead>
            <TableHead>Buy Rate (₦)</TableHead>
            <TableHead>Sell Rate (₦)</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.length > 0 ? (
            rates.map((rate) => (
              <RateRow
                key={rate.id}
                rate={rate}
                isEditing={editingId === rate.id}
                editForm={editForm}
                onEdit={() => handleEdit(rate)}
                onSave={() => handleSave(rate.id)}
                onCancel={handleCancel}
                onFormChange={handleFormChange}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                No exchange rates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Note: These rates are updated daily and apply to all platform transactions.</p>
      </div>
    </div>
  );
};

export default RatesTab;
