'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Users2, FileText } from 'lucide-react';

interface Stats {
  totalAlumnos: number;
  totalMaestros: number;
  totalAulas: number;
  totalProgenitores: number;
}

interface ReportStatsProps {
  stats: Stats;
}

export function ReportStats({ stats }: ReportStatsProps) {
  const statCards = [
    {
      title: 'Alumnos',
      value: stats.totalAlumnos,
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Maestros',
      value: stats.totalMaestros,
      icon: BookOpen,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Aulas',
      value: stats.totalAulas,
      icon: FileText,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Progenitores',
      value: stats.totalProgenitores,
      icon: Users2,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} rounded-lg p-2`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Registros totales</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
