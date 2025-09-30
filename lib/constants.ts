import {
  PackageCheck,
  Clock3,
  LoaderCircle,
  PackageX,
  LucideIcon,
} from "lucide-react";

export const CURRENCY = "FCFA";

export const ORDER_STATUS: Record<
  string,
  {
    label: string;
    color: string;
    icon: LucideIcon;
  }
> = {
  delivered: {
    label: "Livrée",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: PackageCheck,
  },
  pending: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: Clock3,
  },
  processing: {
    label: "Traitement",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: LoaderCircle,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: PackageX,
  },

} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
