'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alumno } from '@/lib/types';
import { apiPost, apiPut } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface AlumnoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alumno: Alumno | null;
  onSuccess: (alumno: Alumno) => void;
}

export function AlumnoFormDialog({
  open,
  onOpenChange,
  alumno,
  onSuccess,
}: AlumnoFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    DocumentType: 'DNI',
    DocumentNumber: '',
    DateOfBirth: '',
    Gender: '',
    Address: '',
    City: '',
    PostalCode: '',
    SpecialNeeds: '',
    MedicalInfo: '',
  });
  const { toast } = useToast();

  // Actualizar formulario cuando el alumno cambia
  useEffect(() => {
    if (alumno) {
      setFormData({
        FirstName: alumno.FirstName || '',
        LastName: alumno.LastName || '',
        Email: alumno.Email || '',
        Phone: alumno.Phone || '',
        DocumentType: alumno.DocumentType || 'DNI',
        DocumentNumber: alumno.DocumentNumber || '',
        DateOfBirth: alumno.DateOfBirth ? new Date(alumno.DateOfBirth).toISOString().split('T')[0] : '',
        Gender: alumno.Gender || '',
        Address: alumno.Address || '',
        City: alumno.City || '',
        PostalCode: alumno.PostalCode || '',
        SpecialNeeds: alumno.SpecialNeeds || '',
        MedicalInfo: alumno.MedicalInfo || '',
      });
    } else {
      // Limpiar formulario para nuevo alumno
      setFormData({
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: '',
        DocumentType: 'DNI',
        DocumentNumber: '',
        DateOfBirth: '',
        Gender: '',
        Address: '',
        City: '',
        PostalCode: '',
        SpecialNeeds: '',
        MedicalInfo: '',
      });
    }
  }, [alumno, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email || null,
        Phone: formData.Phone || null,
        DocumentType: formData.DocumentType || null,
        DocumentNumber: formData.DocumentNumber || null,
        DateOfBirth: formData.DateOfBirth ? new Date(formData.DateOfBirth) : null,
        Gender: formData.Gender || null,
        Address: formData.Address || null,
        City: formData.City || null,
        PostalCode: formData.PostalCode || null,
        SpecialNeeds: formData.SpecialNeeds || null,
        MedicalInfo: formData.MedicalInfo || null,
      };

      let result;
      if (alumno?.AlumnoId) {
        result = await apiPut(`/api/alumnos/${alumno.AlumnoId}`, data);
      } else {
        result = await apiPost('/api/alumnos', data);
      }

      if (result) {
        onSuccess(result);
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('[v0] Error saving alumno:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email || null,
        Phone: formData.Phone || null,
        DocumentType: formData.DocumentType || null,
        DocumentNumber: formData.DocumentNumber || null,
        DateOfBirth: formData.DateOfBirth ? new Date(formData.DateOfBirth) : null,
        Gender: formData.Gender || null,
        Address: formData.Address || null,
        City: formData.City || null,
        PostalCode: formData.PostalCode || null,
        SpecialNeeds: formData.SpecialNeeds || null,
        MedicalInfo: formData.MedicalInfo || null,
      };

      let result;
      if (alumno?.AlumnoId) {
        result = await apiPut(`/api/alumnos/${alumno.AlumnoId}`, data);
      } else {
        result = await apiPost('/api/alumnos', data);
      }

      if (result) {
        onSuccess(result);
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('[v0] Error saving alumno:', error);
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
          <DialogTitle>{alumno ? 'Editar Alumno' : 'Nuevo Alumno'}</DialogTitle>
          <DialogDescription>
            {alumno ? 'Actualiza la información del alumno' : 'Completa los datos del nuevo alumno'}
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
              <Input
                placeholder="Fecha de Nacimiento"
                type="date"
                value={formData.DateOfBirth}
                onChange={(e) => setFormData({ ...formData, DateOfBirth: e.target.value })}
              />
              <select
                value={formData.Gender}
                onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar Género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
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
                placeholder="Email"
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              />
              <Input
                placeholder="Teléfono"
                value={formData.Phone}
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
              />
            </div>
          </div>

          {/* Dirección */}
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

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Información Adicional</h3>
            <textarea
              placeholder="Necesidades Especiales"
              value={formData.SpecialNeeds}
              onChange={(e) => setFormData({ ...formData, SpecialNeeds: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={2}
            />
            <textarea
              placeholder="Información Médica"
              value={formData.MedicalInfo}
              onChange={(e) => setFormData({ ...formData, MedicalInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={2}
            />
          </div>

          {/* Acciones */}
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{alumno ? 'Editar Alumno' : 'Nuevo Alumno'}</DialogTitle>
          <DialogDescription>
            {alumno ? 'Actualiza la información del alumno' : 'Completa los datos del nuevo alumno'}
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
              <Input
                placeholder="Fecha de Nacimiento"
                type="date"
                value={formData.DateOfBirth}
                onChange={(e) => setFormData({ ...formData, DateOfBirth: e.target.value })}
              />
              <select
                value={formData.Gender}
                onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar Género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
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
                placeholder="Email"
                type="email"
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              />
              <Input
                placeholder="Teléfono"
                value={formData.Phone}
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
              />
            </div>
          </div>

          {/* Dirección */}
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

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Información Adicional</h3>
            <textarea
              placeholder="Necesidades Especiales"
              value={formData.SpecialNeeds}
              onChange={(e) => setFormData({ ...formData, SpecialNeeds: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={2}
            />
            <textarea
              placeholder="Información Médica"
              value={formData.MedicalInfo}
              onChange={(e) => setFormData({ ...formData, MedicalInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={2}
            />
          </div>

          {/* Acciones */}
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
