"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { ClientsTable } from "@/components/clients-table";
import { columns } from "./columns";
import { ClientDetailsDialog } from "@/components/client-details-dialog";
import { UserR } from "@/lib/utils";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ClientsPage() {
  const [users, setUsers] = useState<UserR[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [selectedUser, setSelectedUser] = useState<UserR | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
      });

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des clients");
      }
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la récupération des clients", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  useEffect(() => {
    const handleViewUser = (event: Event) => {
      const customEvent = event as CustomEvent<UserR>;
      setSelectedUser(customEvent.detail);
      setIsDetailsOpen(true);
    };

    const handleDeleteUser = async (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;

      try {
        const response = await fetch(`/api/users/${customEvent.detail}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du client");
        }

        toast.success("Client supprimé avec succès", {
          duration: 3000,
          position: "top-right",
        });

        fetchUsers(pagination.page);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la suppression du client", {
          duration: 3000,
          position: "top-right",
        });
      }
    };

    window.addEventListener("viewUser", handleViewUser);
    window.addEventListener("deleteUser", handleDeleteUser);

    return () => {
      window.removeEventListener("viewUser", handleViewUser);
      window.removeEventListener("deleteUser", handleDeleteUser);
    };
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Liste des clients</CardTitle>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="h-12 px-4 flex items-center border-b">
                  <div className="flex items-center gap-4 w-full">
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-[100px] flex-shrink-0" />
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  </div>
                </div>
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="h-16 px-4 flex items-center border-b last:border-0"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-[100px] flex-shrink-0" />
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ClientsTable
              columns={columns}
              data={users}
              pagination={pagination}
              onPageChange={handlePageChange}
              onViewUser={(user) => {
                setSelectedUser(user);
                setIsDetailsOpen(true);
              }}
              onDeleteUser={async (userId) => {
                if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?"))
                  return;

                try {
                  const response = await fetch(`/api/users/${userId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) {
                    throw new Error("Erreur lors de la suppression du client");
                  }

                  toast.success("Client supprimé avec succès", {
                    duration: 3000,
                    position: "top-right",
                  });

                  fetchUsers(pagination.page);
                } catch (error) {
                  console.error("Erreur:", error);
                  toast.error("Erreur lors de la suppression du client", {
                    duration: 3000,
                    position: "top-right",
                  });
                }
              }}
            />
          )}
        </CardContent>
      </Card>

      <ClientDetailsDialog
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
