'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Aula } from '@/lib/types';

interface AulaDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aula: Aula | null;
}

export function AulaDetailDialog({
  open,
  onOpenChange,
  aula,
}: AulaDetailDialogProps) {
  if (!aula) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{aula.Name}</DialogTitle>
          <DialogDescription>Información del aula</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nombre</p>
              <p className="font-medium">{aula.Name}</p>
            </div>
            <div>
              <p className="text-gray-600">Nivel</p>
              <p className="font-medium">{aula.Level || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Capacidad</p>
              <p className="font-medium">{aula.Capacity}</p>
            </div>
            <div>
              <p className="text-gray-600">Estado</p>
              <p className="font-medium">
                {aula.IsActive ? 'Activa' : 'Inactiva'}
              </p>
            </div>
          </div>

          {aula.Description && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Descripción</p>
              <p className="text-sm font-medium mt-1">{aula.Description}</p>
            </div>
          )}

          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <p>Creado: {new Date(aula.CreatedAt).toLocaleDateString('es-ES')}</p>
            <p>Actualizado: {new Date(aula.UpdatedAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
