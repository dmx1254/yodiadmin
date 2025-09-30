import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CART } from "./types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function covertDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export interface OrderR {
  _id: string;
  userId: string;
  products: CART[];
  shippingCost: number;
  total: number;
  paymentMethod: string;
  shippingInfo: IShippingInfo;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  delivery: string;
  message: string;
  phone: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface UserR {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}


export interface ProductR {
  _id: string;
  title: string;
  price: number;
  category: string;
  subCategory?: string;
  discount?: number;
  imageUrl: string;
  benefits?: string[];
  stock: number;
  brand?: string;
  sku?: string;
  etiquette?: string;
  description?: string;
  usage?: string;
  createdAt: string;
  updatedAt: string;
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(amount);
};
