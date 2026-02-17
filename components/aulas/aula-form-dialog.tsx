'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Aula } from '@/lib/types';
import { apiPost, apiPut } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface AulaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aula: Aula | null;
  onSuccess: (aula: Aula) => void;
}

export function AulaFormDialog({
  open,
  onOpenChange,
  aula,
  onSuccess,
}: AulaFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: aula?.Name || '',
    Level: aula?.Level || '',
    Capacity: aula?.Capacity || 30,
    Description: aula?.Description || '',
  });
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.Name) {
        throw new Error('El nombre del aula es requerido');
      }

      const data = {
        Name: formData.Name,
        Level: formData.Level || null,
        Capacity: formData.Capacity,
        Description: formData.Description || null,
      };

      let result;
      if (aula) {
        result = await apiPut(`/api/aulas/${aula.AulaId}`, data);
      } else {
        result = await apiPost('/api/aulas', data);
      }

      onSuccess(result);
      onOpenChange(false);
    } catch (error: any) {
      console.error('[v0] Error saving aula:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{aula ? 'Editar Aula' : 'Nueva Aula'}</DialogTitle>
          <DialogDescription>
            {aula ? 'Actualiza la información del aula' : 'Crea una nueva aula'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre *</label>
            <Input
              placeholder="Ej: Primer Año"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nivel</label>
            <select
              value={formData.Level}
              onChange={(e) => setFormData({ ...formData, Level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccionar Nivel</option>
              <option value="Iniciación">Iniciación</option>
              <option value="Primer Año">Primer Año</option>
              <option value="Segundo Año">Segundo Año</option>
              <option value="Tercer Año">Tercer Año</option>
              <option value="Confirmación">Confirmación</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Capacidad</label>
            <Input
              type="number"
              placeholder="30"
              min="1"
              value={formData.Capacity}
              onChange={(e) => setFormData({ ...formData, Capacity: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              placeholder="Descripción del aula..."
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
