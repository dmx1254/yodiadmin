"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, UserR } from "@/lib/utils";

import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Map,
  Hash,
} from "lucide-react";

interface ClientDetailsDialogProps {
  user: UserR | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientDetailsDialog({
  user,
  open,
  onOpenChange,
}: ClientDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Détails du client
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* En-tête avec la date d'inscription */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Inscrit le {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Nom complet
                  </span>
                </div>
                <p className="text-gray-900 font-medium">
                  {user.firstname} {user.lastname}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Téléphone
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Ville
                  </span>
                </div>
                <p className="text-gray-900 font-medium capitalize">
                  {user.city}
                </p>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              Adresse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Adresse
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.address}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Ville
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.city}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    État/Région
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.country}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    Code postal
                  </span>
                </div>
                <p className="text-gray-900 font-medium">{user.zip}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
