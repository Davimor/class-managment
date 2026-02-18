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
  const [clases, setClases] = useState<any[]>([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssigned, setShowAssigned] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  async function loadData() {
    try {
      const [alumnosData, clasesData] = await Promise.all([
        apiGet('/api/alumnos'),
        apiGet('/api/clases'),
      ]);
      setAlumnos(alumnosData || []);
      setClases(clasesData || []);
    } catch (error: any) {
      console.error('[v0] Error loading data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive',
      });
    }
  }

  const filteredAlumnos = alumnos.filter((alumno) => {
    const nombreCompleto = alumno.NombreCompleto || `${alumno.FirstName} ${alumno.LastName}`;
    const matchesSearch = nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si no está en modo "mostrar asignados", filtrar solo los no asignados
    if (!showAssigned) {
      return matchesSearch && !alumno.ClaseId;
    }
    
    return matchesSearch;
  });

  function getNombreClase(claseId?: number) {
    if (!claseId) return null;
    const clase = clases.find(c => c.ClaseId === claseId || c.ClaseId === claseId);
    return clase?.Nombre || `Clase ${claseId}`;
  }

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

          {/* Checkbox para mostrar todos */}
          <label className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={showAssigned}
              onChange={(e) => setShowAssigned(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              Mostrar todos los alumnos (incluidos los ya asignados)
            </span>
          </label>

          {/* Lista de alumnos */}
          <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {filteredAlumnos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {showAssigned ? 'No hay alumnos' : 'No hay alumnos sin asignar'}
              </p>
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
                  <div className="ml-3 flex-1">
                    <p className="text-sm">
                      {alumno.NombreCompleto || `${alumno.FirstName} ${alumno.LastName}`}
                    </p>
                    {alumno.ClaseId && (
                      <p className="text-xs text-gray-500">
                        Asignado a: {getNombreClase(alumno.ClaseId)}
                      </p>
                    )}
                  </div>
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
