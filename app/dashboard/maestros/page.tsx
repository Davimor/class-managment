'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import { Maestro } from '@/lib/types';
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
import { useAuth } from '@/hooks/use-auth';
import { MaestroFormDialog } from '@/components/maestros/maestro-form-dialog';
import { MaestroDetailDialog } from '@/components/maestros/maestro-detail-dialog';

export default function MaestrosPage() {
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [filteredMaestros, setFilteredMaestros] = useState<Maestro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMaestro, setSelectedMaestro] = useState<Maestro | null>(null);
  const [editingMaestro, setEditingMaestro] = useState<Maestro | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadMaestros();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMaestros(maestros);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredMaestros(
        maestros.filter(
          (m) =>
            (m as any).UserFullName?.toLowerCase().includes(term) ||
            (m as any).Email?.toLowerCase().includes(term) ||
            m.Specialty?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, maestros]);

  async function loadMaestros() {
    try {
      setIsLoading(true);
      const data = await apiGet('/api/maestros');
      setMaestros(data || []);
    } catch (error: any) {
      console.error('[v0] Error loading maestros:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los maestros',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(maestroId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este maestro?')) {
      return;
    }

    try {
      await apiDelete(`/api/maestros/${maestroId}`);
      setMaestros(maestros.filter((m) => m.MaestroId !== maestroId));
      toast({
        title: 'Éxito',
        description: 'Maestro eliminado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  function handleEdit(maestro: Maestro) {
    setEditingMaestro(maestro);
    setIsFormOpen(true);
  }

  function handleView(maestro: Maestro) {
    setSelectedMaestro(maestro);
    setIsDetailOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingMaestro(null);
  }

  function handleFormSuccess(maestro: Maestro) {
    if (editingMaestro) {
      setMaestros(maestros.map((m) => (m.MaestroId === maestro.MaestroId ? maestro : m)));
    } else {
      setMaestros([...maestros, maestro]);
    }
    handleFormClose();
    toast({
      title: 'Éxito',
      description: editingMaestro ? 'Maestro actualizado correctamente' : 'Maestro creado correctamente',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maestros</h1>
          <p className="text-gray-600 mt-1">Gestiona los maestros/catequistas</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingMaestro(null);
              setIsFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Maestro
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Maestros</CardTitle>
          <CardDescription>{filteredMaestros.length} maestros registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando maestros...</p>
            </div>
          ) : filteredMaestros.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay maestros registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaestros.map((maestro) => (
                    <TableRow key={maestro.MaestroId}>
                      <TableCell className="font-medium">
                        {(maestro as any).UserFullName || 'N/A'}
                      </TableCell>
                      <TableCell>{(maestro as any).Email || '-'}</TableCell>
                      <TableCell>{maestro.Phone || '-'}</TableCell>
                      <TableCell>{maestro.Specialty || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(maestro)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleEdit(maestro)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4 text-amber-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(maestro.MaestroId)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </>
                          )}
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

      <MaestroFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        maestro={editingMaestro}
        onSuccess={handleFormSuccess}
      />
      <MaestroDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        maestro={selectedMaestro}
      />
    </div>
  );
}
