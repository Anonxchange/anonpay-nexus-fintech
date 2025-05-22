
import { VtuProduct, VtuProvider } from "../types";

// Mock data for VTU products
export const mockVtuProducts: VtuProduct[] = [
  {
    id: "1",
    name: "MTN Airtime",
    description: "Top up your MTN line",
    imageUrl: "https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "airtime",
    hasVariants: false,
    price: 0,  // Variable price for airtime
    providerId: "mtn"
  },
  {
    id: "2",
    name: "Airtel Airtime",
    description: "Top up your Airtel line",
    imageUrl: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "airtime",
    hasVariants: false,
    price: 0,  // Variable price for airtime
    providerId: "airtel"
  },
  {
    id: "3",
    name: "MTN Data - 1GB",
    description: "1GB data valid for 30 days",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "data",
    hasVariants: false,
    price: 1000,
    providerId: "mtn"
  },
  {
    id: "4",
    name: "Airtel Data - 1GB",
    description: "1GB data valid for 30 days",
    imageUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "data",
    hasVariants: false,
    price: 1000,
    providerId: "airtel"
  },
  {
    id: "5",
    name: "DSTV Subscription",
    description: "Pay for your DSTV subscription",
    imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "cable",
    hasVariants: false,
    price: 7000,
    providerId: "dstv"
  }
];

// Mock data for VTU providers
export const mockVtuProviders: VtuProvider[] = [
  {
    id: "mtn",
    name: "MTN",
    code: "MTN",
    isActive: true
  },
  {
    id: "airtel",
    name: "Airtel",
    code: "AIRTEL",
    isActive: true
  },
  {
    id: "glo",
    name: "Glo",
    code: "GLO",
    isActive: true
  },
  {
    id: "9mobile",
    name: "9Mobile",
    code: "ETISALAT",
    isActive: true
  },
  {
    id: "dstv",
    name: "DSTV",
    code: "DSTV",
    isActive: true
  }
];
