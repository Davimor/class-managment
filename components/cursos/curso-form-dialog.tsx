'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CursoFormSchema = z.object({
  Nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  Tipo: z.enum(['fundamentacion', 'pedagogia', 'dogmatico']),
  Descripcion: z.string().optional(),
  Contenido: z.string().optional(),
  Duracion: z.coerce.number().optional(),
});

type CursoFormValues = z.infer<typeof CursoFormSchema>;

interface CursoFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  curso?: any | null;
  onSave: (curso: any) => void;
  token: string;
}

export default function CursoFormDialog({
  isOpen,
  onClose,
  curso,
  onSave,
  token,
}: CursoFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CursoFormValues>({
    resolver: zodResolver(CursoFormSchema),
    defaultValues: {
      Nombre: curso?.Nombre || '',
      Tipo: curso?.Tipo || 'fundamentacion',
      Descripcion: curso?.Descripcion || '',
      Contenido: curso?.Contenido || '',
      Duracion: curso?.Duracion || 0,
    },
  });

  async function handleSubmit(values: CursoFormValues) {
    try {
      setIsLoading(true);

      const url = curso ? `/api/cursos/${curso.CursoId}` : '/api/cursos';
      const method = curso ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data.data || data);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{curso ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="Nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Curso</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Fundamentación en Catequesis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Curso</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fundamentacion">Fundamentación</SelectItem>
                      <SelectItem value="pedagogia">Pedagogía</SelectItem>
                      <SelectItem value="dogmatico">Contenido Dogmático</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción del curso..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Contenido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Temas y contenido del curso..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Duracion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración (horas)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
