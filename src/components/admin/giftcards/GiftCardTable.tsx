
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, X } from "lucide-react";
import { GiftCardTableProps } from "./types";

const GiftCardTable: React.FC<GiftCardTableProps> = ({
  cards,
  editingId,
  editForm,
  onEdit,
  onSave,
  onCancel,
  setEditForm,
}) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">No gift cards found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Card</TableHead>
          <TableHead>Buy Rate (₦)</TableHead>
          <TableHead>Sell Rate (₦)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cards.map((card) => (
          <TableRow key={card.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                {card.imageUrl && (
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="h-10 w-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{card.name}</p>
                  <p className="text-sm text-gray-500">{card.description}</p>
                  {card.submissionCount > 0 && (
                    <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200">
                      {card.submissionCount} pending
                    </Badge>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {editingId === card.id ? (
                <Input
                  type="number"
                  value={editForm.buyRate}
                  onChange={(e) => setEditForm({ ...editForm, buyRate: parseFloat(e.target.value) })}
                  className="w-32"
                />
              ) : (
                <>₦{card.buyRate.toLocaleString()}</>
              )}
            </TableCell>
            <TableCell>
              {editingId === card.id ? (
                <Input
                  type="number"
                  value={editForm.sellRate}
                  onChange={(e) => setEditForm({ ...editForm, sellRate: parseFloat(e.target.value) })}
                  className="w-32"
                />
              ) : (
                <>₦{card.sellRate.toLocaleString()}</>
              )}
            </TableCell>
            <TableCell>
              {editingId === card.id ? (
                <select
                  value={editForm.isActive ? "active" : "inactive"}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "active" })}
                  className="px-2 py-1 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <Badge className={card.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {card.isActive ? "Active" : "Inactive"}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {editingId === card.id ? (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSave(card.id)}
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
                  onClick={() => onEdit(card)}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GiftCardTable;
