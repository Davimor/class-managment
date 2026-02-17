'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alumno } from '@/lib/types';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api-client';
import { Progenitor } from '@/lib/types';

interface AlumnoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alumno: Alumno | null;
}

export function AlumnoDetailDialog({
  open,
  onOpenChange,
  alumno,
}: AlumnoDetailDialogProps) {
  const [progenitores, setProgenitores] = useState<Progenitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && alumno) {
      loadProgenitores();
    }
  }, [open, alumno]);

  async function loadProgenitores() {
    if (!alumno) return;
    try {
      setIsLoading(true);
      const data = await apiGet(
        `/api/alumnos/${alumno.AlumnoId}/progenitores`
      );
      setProgenitores(data || []);
    } catch (error) {
      console.error('[v0] Error loading progenitores:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!alumno) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {alumno.FirstName} {alumno.LastName}
          </DialogTitle>
          <DialogDescription>Información completa del alumno</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nombre Completo</p>
                <p className="font-medium">
                  {alumno.FirstName} {alumno.LastName}
                </p>
              </div>
              {alumno.DateOfBirth && (
                <div>
                  <p className="text-gray-600">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {new Date(alumno.DateOfBirth).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
              {alumno.DocumentNumber && (
                <div>
                  <p className="text-gray-600">Documento</p>
                  <p className="font-medium">
                    {alumno.DocumentType} - {alumno.DocumentNumber}
                  </p>
                </div>
              )}
              {alumno.Gender && (
                <div>
                  <p className="text-gray-600">Género</p>
                  <p className="font-medium">
                    {alumno.Gender === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Contacto</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {alumno.Email && (
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{alumno.Email}</p>
                </div>
              )}
              {alumno.Phone && (
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-medium">{alumno.Phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Domicilio */}
          {alumno.Address && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Domicilio</h3>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Dirección</p>
                  <p className="font-medium">{alumno.Address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {alumno.City && (
                    <div>
                      <p className="text-gray-600">Ciudad</p>
                      <p className="font-medium">{alumno.City}</p>
                    </div>
                  )}
                  {alumno.PostalCode && (
                    <div>
                      <p className="text-gray-600">Código Postal</p>
                      <p className="font-medium">{alumno.PostalCode}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Información Médica */}
          {(alumno.SpecialNeeds || alumno.MedicalInfo) && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Información Especial</h3>
              <div className="space-y-3 text-sm">
                {alumno.SpecialNeeds && (
                  <div>
                    <p className="text-gray-600">Necesidades Especiales</p>
                    <p className="font-medium">{alumno.SpecialNeeds}</p>
                  </div>
                )}
                {alumno.MedicalInfo && (
                  <div>
                    <p className="text-gray-600">Información Médica</p>
                    <p className="font-medium">{alumno.MedicalInfo}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progenitores */}
          {!isLoading && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-900">Progenitores/Tutores</h3>
              {progenitores.length > 0 ? (
                <div className="space-y-3">
                  {progenitores.map((prog) => (
                    <div
                      key={prog.ProgenitorId}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium">
                        {prog.FirstName} {prog.LastName}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Relación: {prog.RelationshipType}
                      </p>
                      <div className="text-sm space-y-1 mt-2">
                        {prog.Phone && <p>Teléfono: {prog.Phone}</p>}
                        {prog.Email && <p>Email: {prog.Email}</p>}
                        {prog.IsEmergencyContact && (
                          <p className="text-indigo-600 font-semibold">
                            ✓ Contacto de Emergencia
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No hay progenitores/tutores registrados
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
