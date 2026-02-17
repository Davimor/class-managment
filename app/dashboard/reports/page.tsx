'use client';

import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Table as TableIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [reportStats, setReportStats] = useState<any>(null);
  const { toast } = useToast();

  const reports: ReportType[] = [
    {
      id: 'alumnos',
      name: 'Listado de Alumnos',
      description: 'Reporte completo de todos los alumnos inscritos',
      icon: <TableIcon className="w-6 h-6" />,
    },
    {
      id: 'maestros',
      name: 'Listado de Maestros',
      description: 'Listado de maestros y sus asignaciones',
      icon: <TableIcon className="w-6 h-6" />,
    },
    {
      id: 'asistencia',
      name: 'Asistencia por Aula',
      description: 'Reporte de asistencia mensual por aula',
      icon: <TableIcon className="w-6 h-6" />,
    },
    {
      id: 'calificaciones',
      name: 'Calificaciones',
      description: 'Reporte de calificaciones y desempeño',
      icon: <TableIcon className="w-6 h-6" />,
    },
    {
      id: 'progenitores',
      name: 'Contactos de Emergencia',
      description: 'Listado de progenitores y contactos de emergencia',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 'inscripcion',
      name: 'Resumen de Inscritos',
      description: 'Estadísticas de inscripción por nivel',
      icon: <TableIcon className="w-6 h-6" />,
    },
  ];

  useEffect(() => {
    loadReportStats();
  }, []);

  async function loadReportStats() {
    try {
      const stats = await apiGet('/api/reports/stats');
      setReportStats(stats);
    } catch (error: any) {
      console.error('[v0] Error loading report stats:', error);
    }
  }

  async function generateReport(format: 'pdf' | 'excel', reportId: string) {
    try {
      setIsLoading((prev) => ({ ...prev, [`${reportId}-${format}`]: true }));

      const response = await fetch(`/api/reports/generate?type=${reportId}&format=${format}`);

      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }

      // Obtener el blob y crear un URL para descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      a.download = `${reportId}-${timestamp}.${extension}`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Éxito',
        description: `Reporte generado en ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      console.error('[v0] Error generating report:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo generar el reporte',
        variant: 'destructive',
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [`${reportId}-${format}`]: false }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-1">Genera y descarga reportes en PDF o Excel</p>
      </div>

      {reportStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Alumnos</p>
                <p className="text-3xl font-bold text-indigo-600">{reportStats.totalAlumnos}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Maestros</p>
                <p className="text-3xl font-bold text-green-600">{reportStats.totalMaestros}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total de Aulas</p>
                <p className="text-3xl font-bold text-blue-600">{reportStats.totalAulas}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-indigo-600 mt-1">{report.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateReport('pdf', report.id)}
                  disabled={isLoading[`${report.id}-pdf`]}
                  variant="outline"
                  className="gap-2 flex-1"
                >
                  {isLoading[`${report.id}-pdf`] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => generateReport('excel', report.id)}
                  disabled={isLoading[`${report.id}-excel`]}
                  variant="outline"
                  className="gap-2 flex-1"
                >
                  {isLoading[`${report.id}-excel`] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Excel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
