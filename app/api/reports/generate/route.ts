import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthAndRole } from '@/lib/api-auth';
import { mockAlumnos } from '@/lib/mock-data';
import {
  generateAlumnosCSV,
  generateAlumnosReportJSON,
  generateAlumnosReportHTML,
} from '@/lib/services/reports.service';

/**
 * POST /api/reports/generate - Genera reportes en diferentes formatos
 */
export async function POST(request: NextRequest) {
  try {
    const { decoded, error } = await verifyAuthAndRole(request, ['admin', 'secretaria']);
    if (error) return error;

    const body = await request.json();
    const { reportType, format } = body;

    if (!reportType || !format) {
      return NextResponse.json(
        { error: 'reportType y format son requeridos' },
        { status: 400 }
      );
    }

    let content = '';
    let contentType = 'text/plain';
    let filename = '';

    if (reportType === 'alumnos') {
      switch (format) {
        case 'csv':
          content = await generateAlumnosCSV();
          contentType = 'text/csv';
          filename = `alumnos-${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'json':
          const json = await generateAlumnosReportJSON();
          content = JSON.stringify(json, null, 2);
          contentType = 'application/json';
          filename = `alumnos-${new Date().toISOString().split('T')[0]}.json`;
          break;

        case 'html':
          content = await generateAlumnosReportHTML();
          contentType = 'text/html';
          filename = `alumnos-${new Date().toISOString().split('T')[0]}.html`;
          break;

        default:
          return NextResponse.json({ error: 'Formato no soportado' }, { status: 400 });
      }
    }

    // Retornar el contenido generado
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('[API] Error generando reporte:', error);
    return NextResponse.json(
      { error: error.message || 'Error al generar reporte' },
      { status: 500 }
    );
  }
}
