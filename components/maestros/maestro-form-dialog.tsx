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
import { Maestro } from '@/lib/types';
import { apiPost, apiPut, apiGet } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface MaestroFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maestro: Maestro | null;
  onSuccess: (maestro: Maestro) => void;
}

export function MaestroFormDialog({
  open,
  onOpenChange,
  maestro,
  onSuccess,
}: MaestroFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState({
    UserId: maestro?.UserId || 0,
    Phone: maestro?.Phone || '',
    Specialty: maestro?.Specialty || '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && !maestro) {
      loadUsers();
    }
  }, [open, maestro]);

  async function loadUsers() {
    try {
      setLoadingUsers(true);
      const data = await apiGet('/api/users?role=maestro');
      setUsers(data || []);
    } catch (error: any) {
      console.error('[v0] Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.UserId) {
        throw new Error('Debe seleccionar un usuario');
      }

      const data = {
        UserId: formData.UserId,
        Phone: formData.Phone || null,
        Specialty: formData.Specialty || null,
      };

      let result;
      if (maestro) {
        result = await apiPut(`/api/maestros/${maestro.MaestroId}`, data);
      } else {
        result = await apiPost('/api/maestros', data);
      }

      onSuccess(result);
      onOpenChange(false);
    } catch (error: any) {
      console.error('[v0] Error saving maestro:', error);
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
          <DialogTitle>{maestro ? 'Editar Maestro' : 'Nuevo Maestro'}</DialogTitle>
          <DialogDescription>
            {maestro ? 'Actualiza la información del maestro' : 'Asigna un usuario como maestro'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!maestro && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Usuario *</label>
              <select
                value={formData.UserId}
                onChange={(e) => setFormData({ ...formData, UserId: parseInt(e.target.value) })}
                disabled={loadingUsers}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                required
              >
                <option value={0}>
                  {loadingUsers ? 'Cargando usuarios...' : 'Seleccionar Usuario'}
                </option>
                {users.map((user) => (
                  <option key={user.UserId} value={user.UserId}>
                    {user.FullName} ({user.Email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Teléfono</label>
            <Input
              placeholder="Ej: +34 123 456 789"
              value={formData.Phone}
              onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Especialidad</label>
            <Input
              placeholder="Ej: Catecismo, Liturgia, Biblia"
              value={formData.Specialty}
              onChange={(e) => setFormData({ ...formData, Specialty: e.target.value })}
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
