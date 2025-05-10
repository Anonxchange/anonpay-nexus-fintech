
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, X } from "lucide-react";
import { ExtendedGiftCard } from "./types";

interface GiftCardTableProps {
  cards: ExtendedGiftCard[];
  editingId: string | null;
  editForm: {
    buyRate: number;
    sellRate: number;
    isActive: boolean;
  };
  onEdit: (card: ExtendedGiftCard) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  setEditForm: React.Dispatch<React.SetStateAction<{
    buyRate: number;
    sellRate: number;
    isActive: boolean;
  }>>;
}

const GiftCardTable: React.FC<GiftCardTableProps> = ({
  cards,
  editingId,
  editForm,
  onEdit,
  onSave,
  onCancel,
  setEditForm,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Card Rates Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card Name</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Buy Rate (₦)</TableHead>
                <TableHead className="text-right">Sell Rate (₦)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Pending</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {card.imageUrl && (
                        <img 
                          src={card.imageUrl} 
                          alt={card.name} 
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      {card.name}
                    </div>
                  </TableCell>
                  <TableCell>{card.currency}</TableCell>
                  <TableCell className="text-right">
                    {editingId === card.id ? (
                      <Input
                        className="w-24 text-right"
                        type="number"
                        value={editForm.buyRate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            buyRate: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    ) : (
                      card.buyRate
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === card.id ? (
                      <Input
                        className="w-24 text-right"
                        type="number"
                        value={editForm.sellRate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            sellRate: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    ) : (
                      card.sellRate
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingId === card.id ? (
                      <Switch
                        checked={editForm.isActive}
                        onCheckedChange={(checked) =>
                          setEditForm({
                            ...editForm,
                            isActive: checked,
                          })
                        }
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          card.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {card.submissionCount > 0 ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-100 text-amber-700 text-xs">
                        {card.submissionCount}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === card.id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSave(card.id)}
                        >
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCancel}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(card)}
                      >
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {cards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No gift cards found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftCardTable;
