
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ExchangeRate {
  id: string;
  currency_code: string;
  currency_name: string;
  buy_rate: number;
  sell_rate: number;
  last_updated: string;
}

export interface EditRateForm {
  buy_rate: number;
  sell_rate: number;
}

export function useRatesManagement() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditRateForm>({ buy_rate: 0, sell_rate: 0 });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        
        // Since we don't have an actual exchange_rates table in the database,
        // we'll use mock data instead
        setTimeout(() => {
          const mockRates: ExchangeRate[] = [
            {
              id: "1",
              currency_code: "USD",
              currency_name: "US Dollar",
              buy_rate: 750,
              sell_rate: 780,
              last_updated: new Date().toISOString()
            },
            {
              id: "2",
              currency_code: "EUR",
              currency_name: "Euro",
              buy_rate: 830,
              sell_rate: 860,
              last_updated: new Date().toISOString()
            },
            {
              id: "3",
              currency_code: "GBP",
              currency_name: "British Pound",
              buy_rate: 960,
              sell_rate: 990,
              last_updated: new Date().toISOString()
            },
            {
              id: "4",
              currency_code: "BTC",
              currency_name: "Bitcoin",
              buy_rate: 39000000,
              sell_rate: 40000000,
              last_updated: new Date().toISOString()
            },
            {
              id: "5",
              currency_code: "ETH",
              currency_name: "Ethereum",
              buy_rate: 2100000,
              sell_rate: 2150000,
              last_updated: new Date().toISOString()
            }
          ];
          
          setRates(mockRates);
          setLoading(false);
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Error fetching rates:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exchange rates data."
        });
        setLoading(false);
      }
    };
    
    fetchRates();
  }, [toast]);

  // Setup initial rates if table is empty - this is now a mock function
  const setupInitialRates = async () => {
    // This function is no longer needed since we're using mock data
    // It's kept here just for reference
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
      // Since we don't have an actual database table, we'll just update the local state
      setRates(prevRates => 
        prevRates.map(rate => {
          if (rate.id === id) {
            return {
              ...rate,
              buy_rate: editForm.buy_rate,
              sell_rate: editForm.sell_rate,
              last_updated: new Date().toISOString()
            };
          }
          return rate;
        })
      );
      
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

  const handleFormChange = (field: keyof EditRateForm, value: number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    rates,
    loading,
    editingId,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleFormChange
  };
}
