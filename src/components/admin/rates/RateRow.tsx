
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";
import { ExchangeRate, EditRateForm } from "./useRatesManagement";

interface RateRowProps {
  rate: ExchangeRate;
  isEditing: boolean;
  editForm: EditRateForm;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFormChange: (field: keyof EditRateForm, value: number) => void;
}

const RateRow: React.FC<RateRowProps> = ({
  rate,
  isEditing,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onFormChange
}) => {
  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{rate.currency_code}</p>
          <p className="text-sm text-gray-500">{rate.currency_name}</p>
        </div>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editForm.buy_rate}
            onChange={(e) => onFormChange('buy_rate', parseFloat(e.target.value))}
            className="w-32"
          />
        ) : (
          <>₦{rate.buy_rate.toLocaleString()}</>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editForm.sell_rate}
            onChange={(e) => onFormChange('sell_rate', parseFloat(e.target.value))}
            className="w-32"
          />
        ) : (
          <>₦{rate.sell_rate.toLocaleString()}</>
        )}
      </TableCell>
      <TableCell>
        {new Date(rate.last_updated).toLocaleString()}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSave}
              className="text-green-600 border-green-200"
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCancel}
              className="text-red-600 border-red-200"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default RateRow;
