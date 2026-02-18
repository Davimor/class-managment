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
import { apiGet, apiPut } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

interface Alumno {
  AlumnoId: number;
  NombreCompleto: string;
  ClaseId?: number;
  FirstName?: string;
  LastName?: string;
}

interface AsignarAlumnoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claseId: number;
  claseName: string;
  onSuccess: () => void;
}

export function AsignarAlumnoDialog({
  open,
  onOpenChange,
  claseId,
  claseName,
  onSuccess,
}: AsignarAlumnoDialogProps) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadAlumnos();
    }
  }, [open]);

  async function loadAlumnos() {
    try {
      const data = await apiGet('/api/alumnos');
      setAlumnos(data || []);
    } catch (error: any) {
      console.error('[v0] Error loading alumnos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los alumnos',
        variant: 'destructive',
      });
    }
  }

  const filteredAlumnos = alumnos.filter((alumno) => {
    const nombreCompleto = alumno.NombreCompleto || `${alumno.FirstName} ${alumno.LastName}`;
    return nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase());
  });

  async function handleAssign() {
    if (selectedAlumnos.length === 0) {
      toast({
        title: 'Advertencia',
        description: 'Selecciona al menos un alumno',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Asignar cada alumno a la clase
      for (const alumnoId of selectedAlumnos) {
        await apiPut(`/api/alumnos/${alumnoId}`, {
          ClaseId: claseId,
        });
      }

      toast({
        title: 'Éxito',
        description: `${selectedAlumnos.length} alumno(s) asignado(s) a ${claseName}`,
      });

      onSuccess();
      onOpenChange(false);
      setSelectedAlumnos([]);
    } catch (error: any) {
      console.error('[v0] Error assigning alumnos:', error);
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
          <DialogTitle>Asignar Alumnos a {claseName}</DialogTitle>
          <DialogDescription>
            Selecciona los alumnos que deseas asignar a esta clase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar alumno por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Lista de alumnos */}
          <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {filteredAlumnos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay alumnos disponibles</p>
            ) : (
              filteredAlumnos.map((alumno) => (
                <label
                  key={alumno.AlumnoId}
                  className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAlumnos.includes(alumno.AlumnoId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlumnos([...selectedAlumnos, alumno.AlumnoId]);
                      } else {
                        setSelectedAlumnos(
                          selectedAlumnos.filter((id) => id !== alumno.AlumnoId)
                        );
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm">
                    {alumno.NombreCompleto || `${alumno.FirstName} ${alumno.LastName}`}
                    {alumno.ClaseId && (
                      <span className="ml-2 text-xs text-gray-500">
                        (ya asignado a otra clase)
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || selectedAlumnos.length === 0}
              onClick={handleAssign}
            >
              {isLoading ? 'Asignando...' : `Asignar ${selectedAlumnos.length} alumno(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
