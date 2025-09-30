"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditProductDialog } from "./edit-dialog";

export interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  category: string;
  stock: number;
  subCategory?: string;
  discount?: number;
  brand?: string;
  sku?: string;
  etiquette?: string;
  usage?: string;
  benefits?: string[];
}

function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du produit");
      }

      toast.success("Produit supprimé avec succès", {
        duration: 3000,
        position: "top-right",
      });

      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression du produit", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProductDialog
        product={product}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onProductUpdated={() => router.refresh()}
      />
    </>
  );
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="relative h-12 w-12">
          <Image
            src={imageUrl}
            alt={row.getValue("title")}
            fill
            className="object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prix
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const discount = row.original.discount || 0;
      const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
      
      return (
        <div className="font-medium">
          {discount > 0 && (
            <div className="text-sm text-gray-500 line-through">
              {formatCurrency(price)}
            </div>
          )}
          <div className={discount > 0 ? "text-red-600 font-bold" : ""}>
            {formatCurrency(finalPrice)}
          </div>
          {discount > 0 && (
            <div className="text-xs text-green-600">
              -{discount}%
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Catégorie",
  },
  {
    accessorKey: "brand",
    header: "Marque",
    cell: ({ row }) => {
      const brand = row.getValue("brand") as string;
      return <div className="text-sm text-gray-600">{brand || "-"}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <div className={`font-medium ${stock === 0 ? "text-red-600" : stock < 10 ? "text-yellow-600" : "text-green-600"}`}>
          {stock}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
]; 