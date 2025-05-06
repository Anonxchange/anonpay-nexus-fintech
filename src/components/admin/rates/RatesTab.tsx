
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Save, X } from "lucide-react";

interface ExchangeRate {
  id: string;
  currency_code: string;
  currency_name: string;
  buy_rate: number;
  sell_rate: number;
  last_updated: string;
}

const RatesTab: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    buy_rate: number;
    sell_rate: number;
  }>({ buy_rate: 0, sell_rate: 0 });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('exchange_rates')
          .select('*')
          .order('currency_code', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setRates(data);
        } else {
          // If no data exists, we'll use dummy data for initial setup
          await setupInitialRates();
        }
        
      } catch (error) {
        console.error('Error fetching rates:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exchange rates data."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
    
    // Set up a realtime subscription
    const channel = supabase
      .channel('exchange_rates_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'exchange_rates' 
      }, () => {
        fetchRates();
      })
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [toast]);

  // Setup initial rates if table is empty
  const setupInitialRates = async () => {
    const dummyRates: Omit<ExchangeRate, 'id'>[] = [
      {
        currency_code: "USD",
        currency_name: "US Dollar",
        buy_rate: 750,
        sell_rate: 780,
        last_updated: new Date().toISOString()
      },
      {
        currency_code: "EUR",
        currency_name: "Euro",
        buy_rate: 830,
        sell_rate: 860,
        last_updated: new Date().toISOString()
      },
      {
        currency_code: "GBP",
        currency_name: "British Pound",
        buy_rate: 960,
        sell_rate: 990,
        last_updated: new Date().toISOString()
      },
      {
        currency_code: "BTC",
        currency_name: "Bitcoin",
        buy_rate: 39000000,
        sell_rate: 40000000,
        last_updated: new Date().toISOString()
      },
      {
        currency_code: "ETH",
        currency_name: "Ethereum",
        buy_rate: 2100000,
        sell_rate: 2150000,
        last_updated: new Date().toISOString()
      }
    ];

    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .insert(dummyRates)
        .select();
      
      if (error) throw error;
      
      if (data) setRates(data);
    } catch (error) {
      console.error('Error setting up initial rates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set up initial exchange rates."
      });
    }
  };

  const handleEdit = (rate: ExchangeRate) => {
    setEditingId(rate.id);
    setEditForm({
      buy_rate: rate.buy_rate,
      sell_rate: rate.sell_rate
    });
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exchange_rates')
        .update({ 
          buy_rate: editForm.buy_rate,
          sell_rate: editForm.sell_rate,
          last_updated: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Rate Updated",
        description: "The exchange rate has been updated successfully."
      });
      
      setEditingId(null);
    } catch (error) {
      console.error('Error updating rate:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update exchange rate."
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

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
              <TableRow key={rate.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{rate.currency_code}</p>
                    <p className="text-sm text-gray-500">{rate.currency_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      value={editForm.buy_rate}
                      onChange={(e) => setEditForm({ ...editForm, buy_rate: parseFloat(e.target.value) })}
                      className="w-32"
                    />
                  ) : (
                    <>₦{rate.buy_rate.toLocaleString()}</>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      value={editForm.sell_rate}
                      onChange={(e) => setEditForm({ ...editForm, sell_rate: parseFloat(e.target.value) })}
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
                  {editingId === rate.id ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSave(rate.id)}
                        className="text-green-600 border-green-200"
                      >
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCancel}
                        className="text-red-600 border-red-200"
                      >
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(rate)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
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
