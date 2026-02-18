'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
import { AsignarAlumnoDialog } from '@/components/cursos/asignar-alumno-dialog';

interface Clase {
  ClaseId: number;
  Nombre: string;
  CapacidadMaxima: number;
  AlumnosCount: number;
  MaestroId?: number;
}

interface Curso {
  CursoId: number;
  Nombre: string;
  Tipo: 'fundamentacion' | 'pedagogia' | 'dogmatico';
  AñoAcademico: number;
  IsDummy: boolean;
  Clases?: Clase[];
}

export default function CursosPage() {
  const { user, isLoading } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedClase, setSelectedClase] = useState<{ claseId: number; claseName: string } | null>(null);

  useEffect(() => {
    // Mock data - en producción obtener de la API
    setCursos([
      {
        CursoId: 1,
        Nombre: 'Nivel 1',
        Tipo: 'fundamentacion',
        AñoAcademico: 2024,
        IsDummy: false,
        Clases: [
          { ClaseId: 1, Nombre: '1A', CapacidadMaxima: 20, AlumnosCount: 2, MaestroId: 1 },
          { ClaseId: 2, Nombre: '1B', CapacidadMaxima: 18, AlumnosCount: 2, MaestroId: 1 },
        ]
      },
      {
        CursoId: 2,
        Nombre: 'Nivel 2',
        Tipo: 'pedagogia',
        AñoAcademico: 2024,
        IsDummy: false,
        Clases: [
          { ClaseId: 3, Nombre: '2A', CapacidadMaxima: 20, AlumnosCount: 2, MaestroId: 1 },
          { ClaseId: 4, Nombre: '2B', CapacidadMaxima: 18, AlumnosCount: 0, MaestroId: 1 },
        ]
      },
      {
        CursoId: 3,
        Nombre: 'Nivel 3',
        Tipo: 'dogmatico',
        AñoAcademico: 2024,
        IsDummy: false,
        Clases: [
          { ClaseId: 5, Nombre: '3A', CapacidadMaxima: 15, AlumnosCount: 0, MaestroId: 1 },
          { ClaseId: 6, Nombre: '3B', CapacidadMaxima: 17, AlumnosCount: 0, MaestroId: 1 },
          { ClaseId: 7, Nombre: '3C', CapacidadMaxima: 16, AlumnosCount: 0, MaestroId: 1 },
        ]
      },
      {
        CursoId: 4,
        Nombre: 'Nivel 1 - 2025',
        Tipo: 'fundamentacion',
        AñoAcademico: 2025,
        IsDummy: true,
        Clases: []
      },
    ]);
  }, []);

  const tipoLabels = {
    fundamentacion: 'Fundamentación',
    pedagogia: 'Pedagogía',
    dogmatico: 'Dogmático'
  };

  const cursosFiltrados = cursos.filter(curso => {
    const matchYear = curso.AñoAcademico === selectedYear;
    const matchSearch = curso.Nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchYear && matchSearch;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Cargando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cursos y Clases</h1>
          <p className="text-gray-600">Estructura: Curso → Clases (1A, 1B, 2A...) → Alumnos</p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value={2024}>Año 2024</option>
            <option value={2025}>Año 2025</option>
            <option value={2026}>Año 2026</option>
          </select>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Curso
          </Button>
        </div>

        {/* Cursos */}
        <div className="space-y-6">
          {cursosFiltrados.map(curso => (
            <Card key={curso.CursoId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{curso.Nombre}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{tipoLabels[curso.Tipo]}</Badge>
                    <Badge variant="secondary">Año {curso.AñoAcademico}</Badge>
                    {curso.IsDummy && <Badge className="bg-yellow-100 text-yellow-800">Template</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 gap-2">
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </div>

              {/* Clases del Curso */}
              {curso.Clases && curso.Clases.length > 0 ? (
                <div className="mt-6 grid gap-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Clases:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {curso.Clases.map(clase => (
                      <Card key={clase.ClaseId} className="p-4 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{clase.Nombre}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Users className="w-4 h-4" />
                              {clase.AlumnosCount} / {clase.CapacidadMaxima} alumnos
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <p className="font-bold text-blue-600 text-sm">{Math.round((clase.AlumnosCount / clase.CapacidadMaxima) * 100)}%</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-xs"
                              onClick={() => setSelectedClase({ claseId: clase.ClaseId, claseName: clase.Nombre })}
                            >
                              <Plus className="w-3 h-3" />
                              Asignar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">Sin clases creadas. Este es un curso template para el próximo año.</p>
                  <Button variant="outline" className="mt-3 gap-2">
                    <Plus className="w-4 h-4" />
                    Crear Clase
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Dialog para asignar alumnos */}
        {selectedClase && (
          <AsignarAlumnoDialog
            open={!!selectedClase}
            onOpenChange={(open) => {
              if (!open) setSelectedClase(null);
            }}
            claseId={selectedClase.claseId}
            claseName={selectedClase.claseName}
            onSuccess={() => {
              // Actualizar datos si es necesario
              console.log('[v0] Alumnos asignados exitosamente');
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
