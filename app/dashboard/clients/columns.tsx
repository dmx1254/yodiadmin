"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { formatDate, UserR } from "@/lib/utils";


interface ClientActionsProps {
  user: UserR;
  onView: (user: UserR) => void;
  onDelete: (userId: string) => void;
}

function ClientActions({ user, onView, onDelete }: ClientActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => onView(user)}
      >
        <Eye className="h-5 w-5 text-[#A36F5E]" />
        <span className="sr-only">Voir les détails</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => onDelete(user._id)}
      >
        <Trash2 className="h-5 w-5 text-red-400" />
        <span className="sr-only">Supprimer</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<UserR>[] = [
  {
    accessorKey: "firstname",
    header: "Prénom",
  },
  {
    accessorKey: "lastname",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
  },
  {
    accessorKey: "city",
    header: "Ville",
  },
  {
    accessorKey: "createdAt",
    header: "Date d'inscription",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <ClientActions
          user={user}
          onView={(user) => {
            window.dispatchEvent(new CustomEvent("viewUser", { detail: user }));
          }}
          onDelete={(userId) => {
            window.dispatchEvent(new CustomEvent("deleteUser", { detail: userId }));
          }}
        />
      );
    },
  },
]; 