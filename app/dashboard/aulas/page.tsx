'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import { Aula } from '@/lib/types';
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
import { AulaFormDialog } from '@/components/aulas/aula-form-dialog';
import { AulaDetailDialog } from '@/components/aulas/aula-detail-dialog';

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [filteredAulas, setFilteredAulas] = useState<Aula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAulas();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAulas(aulas);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredAulas(
        aulas.filter(
          (aula) =>
            aula.Name.toLowerCase().includes(term) ||
            aula.Level?.toLowerCase().includes(term) ||
            aula.Description?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, aulas]);

  async function loadAulas() {
    try {
      setIsLoading(true);
      const data = await apiGet('/api/aulas');
      setAulas(data || []);
    } catch (error: any) {
      console.error('[v0] Error loading aulas:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las aulas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(aulaId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta aula?')) {
      return;
    }

    try {
      await apiDelete(`/api/aulas/${aulaId}`);
      setAulas(aulas.filter((a) => a.AulaId !== aulaId));
      toast({
        title: 'Éxito',
        description: 'Aula eliminada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  function handleEdit(aula: Aula) {
    setEditingAula(aula);
    setIsFormOpen(true);
  }

  function handleView(aula: Aula) {
    setSelectedAula(aula);
    setIsDetailOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingAula(null);
  }

  function handleFormSuccess(aula: Aula) {
    if (editingAula) {
      setAulas(aulas.map((a) => (a.AulaId === aula.AulaId ? aula : a)));
    } else {
      setAulas([...aulas, aula]);
    }
    handleFormClose();
    toast({
      title: 'Éxito',
      description: editingAula ? 'Aula actualizada correctamente' : 'Aula creada correctamente',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
          <p className="text-gray-600 mt-1">Gestiona las aulas de catequesis</p>
        </div>
        <Button
          onClick={() => {
            setEditingAula(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Aula
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o nivel..."
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
          <CardTitle>Lista de Aulas</CardTitle>
          <CardDescription>{filteredAulas.length} aulas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando aulas...</p>
            </div>
          ) : filteredAulas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay aulas registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAulas.map((aula) => (
                    <TableRow key={aula.AulaId}>
                      <TableCell className="font-medium">{aula.Name}</TableCell>
                      <TableCell>{aula.Level || '-'}</TableCell>
                      <TableCell>{aula.Capacity}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {aula.Description || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(aula)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(aula)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-amber-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(aula.AulaId)}
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

      <AulaFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        aula={editingAula}
        onSuccess={handleFormSuccess}
      />
      <AulaDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} aula={selectedAula} />
    </div>
  );
}
