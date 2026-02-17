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
import { Progenitor } from '@/lib/types';
import { apiPost, apiPut } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface ProgenitorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progenitor: Progenitor | null;
  onSuccess: (progenitor: Progenitor) => void;
}

export function ProgenitorFormDialog({
  open,
  onOpenChange,
  progenitor,
  onSuccess,
}: ProgenitorFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: progenitor?.FirstName || '',
    LastName: progenitor?.LastName || '',
    RelationshipType: progenitor?.RelationshipType || 'padre',
    DocumentType: progenitor?.DocumentType || 'DNI',
    DocumentNumber: progenitor?.DocumentNumber || '',
    Phone: progenitor?.Phone || '',
    Email: progenitor?.Email || '',
    Address: progenitor?.Address || '',
    City: progenitor?.City || '',
    PostalCode: progenitor?.PostalCode || '',
    Occupation: progenitor?.Occupation || '',
    WorkPhone: progenitor?.WorkPhone || '',
    IsEmergencyContact: progenitor?.IsEmergencyContact || false,
  });
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.FirstName || !formData.LastName) {
        throw new Error('Nombre y apellido son requeridos');
      }

      const data = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        RelationshipType: formData.RelationshipType,
        DocumentType: formData.DocumentType || null,
        DocumentNumber: formData.DocumentNumber || null,
        Phone: formData.Phone || null,
        Email: formData.Email || null,
        Address: formData.Address || null,
        City: formData.City || null,
        PostalCode: formData.PostalCode || null,
        Occupation: formData.Occupation || null,
        WorkPhone: formData.WorkPhone || null,
        IsEmergencyContact: formData.IsEmergencyContact,
      };

      let result;
      if (progenitor) {
        result = await apiPut(`/api/progenitores/${progenitor.ProgenitorId}`, data);
      } else {
        result = await apiPost('/api/progenitores', data);
      }

      onSuccess(result);
      onOpenChange(false);
    } catch (error: any) {
      console.error('[v0] Error saving progenitor:', error);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{progenitor ? 'Editar Progenitor' : 'Nuevo Progenitor'}</DialogTitle>
          <DialogDescription>
            {progenitor ? 'Actualiza la información del progenitor' : 'Registra un nuevo progenitor'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Datos Personales</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Nombre"
                value={formData.FirstName}
                onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                required
              />
              <Input
                placeholder="Apellido"
                value={formData.LastName}
                onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                required
              />
              <select
                value={formData.RelationshipType}
                onChange={(e) => setFormData({ ...formData, RelationshipType: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="tutor">Tutor</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Identificación</h3>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.DocumentType}
                onChange={(e) => setFormData({ ...formData, DocumentType: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Otro">Otro</option>
              </select>
              <Input
                placeholder="Número de Documento"
                value={formData.DocumentNumber}
                onChange={(e) => setFormData({ ...formData, DocumentNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Contacto</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Teléfono"
                value={formData.Phone}
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              />
            </div>
          </div>

          {/* Domicilio */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Domicilio</h3>
            <Input
              placeholder="Dirección"
              value={formData.Address}
              onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Ciudad"
                value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })}
              />
              <Input
                placeholder="Código Postal"
                value={formData.PostalCode}
                onChange={(e) => setFormData({ ...formData, PostalCode: e.target.value })}
              />
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Información Laboral</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Profesión/Ocupación"
                value={formData.Occupation}
                onChange={(e) => setFormData({ ...formData, Occupation: e.target.value })}
              />
              <Input
                placeholder="Teléfono Laboral"
                value={formData.WorkPhone}
                onChange={(e) => setFormData({ ...formData, WorkPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Información Especial</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.IsEmergencyContact}
                onChange={(e) => setFormData({ ...formData, IsEmergencyContact: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Contacto de Emergencia</span>
            </label>
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
