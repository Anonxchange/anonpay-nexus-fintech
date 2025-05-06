
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VtuProduct } from "@/services/products/types";
import { getVtuProducts, getVtuProductsByCategory } from "@/services/products/vtuService";

export function useVtuProducts(category: string) {
  const [products, setProducts] = useState<VtuProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data: VtuProduct[];
        if (category) {
          data = await getVtuProductsByCategory(category);
        } else {
          data = await getVtuProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error("Failed to load VTU products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category, toast]);

  return {
    products,
    loading
  };
}
