'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const TIPO_LABELS = {
  fundamentacion: { label: 'Fundamentación', color: 'bg-blue-100 text-blue-800' },
  pedagogia: { label: 'Pedagogía', color: 'bg-green-100 text-green-800' },
  dogmatico: { label: 'Contenido Dogmático', color: 'bg-purple-100 text-purple-800' },
};

interface CursoDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  curso: any;
}

export default function CursoDetailDialog({
  isOpen,
  onClose,
  curso,
}: CursoDetailDialogProps) {
  if (!curso) return null;

  const tipoLabel = TIPO_LABELS[curso.Tipo as keyof typeof TIPO_LABELS];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            {curso.Nombre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Badge className={tipoLabel.color}>
              {tipoLabel.label}
            </Badge>
          </div>

          {curso.Descripcion && (
            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600">{curso.Descripcion}</p>
            </Card>
          )}

          {curso.Contenido && (
            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">Contenido del Curso</h3>
              <p className="text-gray-600 whitespace-pre-line">{curso.Contenido}</p>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            {curso.Duracion && (
              <Card className="p-4">
                <p className="text-sm text-gray-600">Duración</p>
                <p className="text-lg font-semibold text-gray-900">{curso.Duracion} horas</p>
              </Card>
            )}

            {curso.Maestro && (
              <Card className="p-4">
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="text-lg font-semibold text-gray-900">{curso.Maestro.NombreCompleto}</p>
              </Card>
            )}
          </div>

          {curso.FechaInicio && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Fechas</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Inicio</p>
                  <p className="font-medium text-gray-900">
                    {new Date(curso.FechaInicio).toLocaleDateString('es-ES')}
                  </p>
                </div>
                {curso.FechaFin && (
                  <div>
                    <p className="text-gray-600">Fin</p>
                    <p className="font-medium text-gray-900">
                      {new Date(curso.FechaFin).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
