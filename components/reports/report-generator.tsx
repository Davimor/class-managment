'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportGeneratorProps {
  onGenerate?: (type: string, format: string) => void;
}

type ReportType = 'alumnos' | 'maestros' | 'aulas' | 'progenitores' | 'asistencia';
type ExportFormat = 'pdf' | 'excel';

export function ReportGenerator({ onGenerate }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('alumnos');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      onGenerate?.(reportType, exportFormat);

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, format: exportFormat }),
      });

      if (!response.ok) throw new Error('Error generando reporte');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${reportType}-${new Date().toISOString().split('T')[0]}.${
        exportFormat === 'pdf' ? 'pdf' : 'xlsx'
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generador de Reportes
        </CardTitle>
        <CardDescription>Exporta datos en PDF o Excel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Reporte</label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alumnos">Listado de Alumnos</SelectItem>
                  <SelectItem value="maestros">Listado de Maestros</SelectItem>
                  <SelectItem value="aulas">Listado de Aulas</SelectItem>
                  <SelectItem value="progenitores">Listado de Progenitores</SelectItem>
                  <SelectItem value="asistencia">Reporte de Asistencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Formato</label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? 'Generando...' : 'Descargar Reporte'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
