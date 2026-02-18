'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import { Alumno } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlumnoFormDialog } from '@/components/alumnos/alumno-form-dialog';
import { AlumnoDetailDialog } from '@/components/alumnos/alumno-detail-dialog';

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState<Alumno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const { toast } = useToast();

  // Cargar alumnos
  useEffect(() => {
    loadAlumnos();
  }, []);

  // Filtrar alumnos basado en búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAlumnos(alumnos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredAlumnos(
        alumnos.filter(
          (alumno) =>
            alumno.NombreCompleto?.toLowerCase().includes(term) ||
            alumno.Email?.toLowerCase().includes(term) ||
            alumno.Telefono?.includes(term)
        )
      );
    }
  }, [searchTerm, alumnos]);

  async function loadAlumnos() {
    try {
      setIsLoading(true);
      const data = await apiGet('/api/alumnos');
      setAlumnos(data || []);
    } catch (error: any) {
      console.error('[v0] Error loading alumnos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los alumnos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(alumnoId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      return;
    }

    try {
      await apiDelete(`/api/alumnos/${alumnoId}`);
      setAlumnos(alumnos.filter((a) => a.AlumnoId !== alumnoId));
      toast({
        title: 'Éxito',
        description: 'Alumno eliminado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  function handleEdit(alumno: Alumno) {
    setEditingAlumno(alumno);
    setIsFormOpen(true);
  }

  function handleView(alumno: Alumno) {
    setSelectedAlumno(alumno);
    setIsDetailOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingAlumno(null);
  }

  function handleFormSuccess(alumno: Alumno) {
    if (editingAlumno) {
      setAlumnos(alumnos.map((a) => (a.AlumnoId === alumno.AlumnoId ? alumno : a)));
    } else {
      setAlumnos([...alumnos, alumno]);
    }
    handleFormClose();
    toast({
      title: 'Éxito',
      description: editingAlumno ? 'Alumno actualizado correctamente' : 'Alumno creado correctamente',
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alumnos</h1>
          <p className="text-gray-600 mt-1">Gestiona el registro de alumnos de catequesis</p>
        </div>
        <Button
          onClick={() => {
            setEditingAlumno(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Alumno
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alumnos</CardTitle>
          <CardDescription>{filteredAlumnos.length} alumnos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando alumnos...</p>
            </div>
          ) : filteredAlumnos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay alumnos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlumnos.map((alumno) => (
                    <TableRow key={alumno.AlumnoId}>
                      <TableCell className="font-medium">
                        {alumno.FirstName} {alumno.LastName}
                      </TableCell>
                      <TableCell>{alumno.DocumentNumber || '-'}</TableCell>
                      <TableCell>{alumno.Email || '-'}</TableCell>
                      <TableCell>{alumno.Phone || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(alumno)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(alumno)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-amber-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(alumno.AlumnoId)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AlumnoFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        alumno={editingAlumno}
        onSuccess={handleFormSuccess}
      />
      <AlumnoDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        alumno={selectedAlumno}
      />
    </div>
  );
}
