'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progenitor } from '@/lib/types';

interface ProgenitorDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progenitor: Progenitor | null;
}

export function ProgenitorDetailDialog({
  open,
  onOpenChange,
  progenitor,
}: ProgenitorDetailDialogProps) {
  if (!progenitor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {progenitor.FirstName} {progenitor.LastName}
          </DialogTitle>
          <DialogDescription>
            Información completa del progenitor ({progenitor.RelationshipType})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nombre Completo</p>
              <p className="font-medium">
                {progenitor.FirstName} {progenitor.LastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Relación</p>
              <p className="font-medium capitalize">{progenitor.RelationshipType}</p>
            </div>
          </div>

          {progenitor.DocumentNumber && (
            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
              <div>
                <p className="text-gray-600">Tipo de Documento</p>
                <p className="font-medium">{progenitor.DocumentType}</p>
              </div>
              <div>
                <p className="text-gray-600">Número de Documento</p>
                <p className="font-medium">{progenitor.DocumentNumber}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contacto</h3>
            <div className="space-y-2 text-sm">
              {progenitor.Phone && (
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-medium">{progenitor.Phone}</p>
                </div>
              )}
              {progenitor.Email && (
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{progenitor.Email}</p>
                </div>
              )}
            </div>
          </div>

          {progenitor.Address && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Domicilio</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Dirección</p>
                  <p className="font-medium">{progenitor.Address}</p>
                </div>
                {progenitor.City && (
                  <div>
                    <p className="text-gray-600">Ciudad</p>
                    <p className="font-medium">{progenitor.City}</p>
                  </div>
                )}
                {progenitor.PostalCode && (
                  <div>
                    <p className="text-gray-600">Código Postal</p>
                    <p className="font-medium">{progenitor.PostalCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {progenitor.Occupation && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Información Laboral</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Profesión</p>
                  <p className="font-medium">{progenitor.Occupation}</p>
                </div>
                {progenitor.WorkPhone && (
                  <div>
                    <p className="text-gray-600">Teléfono Laboral</p>
                    <p className="font-medium">{progenitor.WorkPhone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {progenitor.IsEmergencyContact && (
            <div className="border-t pt-4">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                Contacto de Emergencia
              </span>
            </div>
          )}

          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <p>Creado: {new Date(progenitor.CreatedAt).toLocaleDateString('es-ES')}</p>
            <p>Actualizado: {new Date(progenitor.UpdatedAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
