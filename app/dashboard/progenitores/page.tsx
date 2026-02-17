'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '@/lib/api-client';
import { Progenitor } from '@/lib/types';
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
import { ProgenitorFormDialog } from '@/components/progenitores/progenitor-form-dialog';
import { ProgenitorDetailDialog } from '@/components/progenitores/progenitor-detail-dialog';

export default function ProgenitoresPage() {
  const [progenitores, setProgenitores] = useState<Progenitor[]>([]);
  const [filteredProgenitores, setFilteredProgenitores] = useState<Progenitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProgenitor, setSelectedProgenitor] = useState<Progenitor | null>(null);
  const [editingProgenitor, setEditingProgenitor] = useState<Progenitor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProgenitores();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProgenitores(progenitores);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProgenitores(
        progenitores.filter(
          (prog) =>
            prog.FirstName.toLowerCase().includes(term) ||
            prog.LastName.toLowerCase().includes(term) ||
            prog.Email?.toLowerCase().includes(term) ||
            prog.DocumentNumber?.includes(term)
        )
      );
    }
  }, [searchTerm, progenitores]);

  async function loadProgenitores() {
    try {
      setIsLoading(true);
      const data = await apiGet('/api/progenitores');
      setProgenitores(data || []);
    } catch (error: any) {
      console.error('[v0] Error loading progenitores:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los progenitores',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(progenitorId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este progenitor?')) {
      return;
    }

    try {
      await apiDelete(`/api/progenitores/${progenitorId}`);
      setProgenitores(progenitores.filter((p) => p.ProgenitorId !== progenitorId));
      toast({
        title: 'Éxito',
        description: 'Progenitor eliminado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  function handleEdit(progenitor: Progenitor) {
    setEditingProgenitor(progenitor);
    setIsFormOpen(true);
  }

  function handleView(progenitor: Progenitor) {
    setSelectedProgenitor(progenitor);
    setIsDetailOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingProgenitor(null);
  }

  function handleFormSuccess(progenitor: Progenitor) {
    if (editingProgenitor) {
      setProgenitores(
        progenitores.map((p) => (p.ProgenitorId === progenitor.ProgenitorId ? progenitor : p))
      );
    } else {
      setProgenitores([...progenitores, progenitor]);
    }
    handleFormClose();
    toast({
      title: 'Éxito',
      description: editingProgenitor
        ? 'Progenitor actualizado correctamente'
        : 'Progenitor creado correctamente',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progenitores</h1>
          <p className="text-gray-600 mt-1">Gestiona los padres, madres y tutores</p>
        </div>
        <Button
          onClick={() => {
            setEditingProgenitor(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Progenitor
        </Button>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Progenitores</CardTitle>
          <CardDescription>{filteredProgenitores.length} progenitores registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando progenitores...</p>
            </div>
          ) : filteredProgenitores.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay progenitores registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Relación</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Emergencia</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgenitores.map((prog) => (
                    <TableRow key={prog.ProgenitorId}>
                      <TableCell className="font-medium">
                        {prog.FirstName} {prog.LastName}
                      </TableCell>
                      <TableCell className="capitalize">{prog.RelationshipType}</TableCell>
                      <TableCell>{prog.Phone || '-'}</TableCell>
                      <TableCell>{prog.Email || '-'}</TableCell>
                      <TableCell>
                        {prog.IsEmergencyContact ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Sí
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(prog)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(prog)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4 text-amber-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(prog.ProgenitorId)}
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

      <ProgenitorFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        progenitor={editingProgenitor}
        onSuccess={handleFormSuccess}
      />
      <ProgenitorDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        progenitor={selectedProgenitor}
      />
    </div>
  );
}
