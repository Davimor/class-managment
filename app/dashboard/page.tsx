'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, User } from 'lucide-react';

interface DashboardStats {
  totalAlumnos: number;
  totalAulas: number;
  totalMaestros: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAlumnos: 0,
    totalAulas: 0,
    totalMaestros: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setIsLoading(true);
      const [alumnos, aulas, maestros] = await Promise.all([
        apiGet('/api/alumnos'),
        apiGet('/api/aulas'),
        apiGet('/api/maestros'),
      ]);

      setStats({
        totalAlumnos: alumnos?.length || 0,
        totalAulas: aulas?.length || 0,
        totalMaestros: maestros?.length || 0,
      });
    } catch (error) {
      console.error('[v0] Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const statCards = [
    {
      title: 'Total Alumnos',
      value: stats.totalAlumnos,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Aulas',
      value: stats.totalAulas,
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Maestros',
      value: stats.totalMaestros,
      icon: User,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido a la gestión de catequesis</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            Sistema de Gestión de Catequesis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Este sistema te permite gestionar alumnos, maestros, aulas y progenitores de tu parroquia.
            Utiliza el menú de la izquierda para navegar entre las diferentes secciones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
