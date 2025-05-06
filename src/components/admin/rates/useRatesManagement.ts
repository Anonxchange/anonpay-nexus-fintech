
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
