'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Maestro } from '@/lib/types';

interface MaestroDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maestro: Maestro | null;
}

export function MaestroDetailDialog({
  open,
  onOpenChange,
  maestro,
}: MaestroDetailDialogProps) {
  if (!maestro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{(maestro as any).UserFullName}</DialogTitle>
          <DialogDescription>Información del maestro</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nombre</p>
              <p className="font-medium">{(maestro as any).UserFullName}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{(maestro as any).Email}</p>
            </div>
            {maestro.Phone && (
              <div>
                <p className="text-gray-600">Teléfono</p>
                <p className="font-medium">{maestro.Phone}</p>
              </div>
            )}
            {maestro.Specialty && (
              <div>
                <p className="text-gray-600">Especialidad</p>
                <p className="font-medium">{maestro.Specialty}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <p>Creado: {new Date(maestro.CreatedAt).toLocaleDateString('es-ES')}</p>
            <p>Actualizado: {new Date(maestro.UpdatedAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
