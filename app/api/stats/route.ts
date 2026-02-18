import { NextRequest, NextResponse } from 'next/server';
import { mockAlumnos, mockMaestros, mockCursos, mockClases } from '@/lib/mock-data';

/**
 * GET /api/stats - Obtiene estadísticas generales
 */
export async function GET(request: NextRequest) {
  try {
    const stats = {
      totalAlumnos: mockAlumnos.length,
      totalMaestros: mockMaestros.length,
      totalCursos: mockCursos.length,
      totalClases: mockClases.length,
      alumnosPorClase: mockClases.map(clase => ({
        claseName: clase.Nombre,
        count: mockAlumnos.filter(a => a.ClaseId === clase.ClaseId).length,
      })),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('[API] Error en GET stats:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
