import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.service';
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
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['admin', 'secretaria'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
    }

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
  );

  return (result.recordset || []).map((row: any) => ({
    id: row.MaestroId,
    nombre: row.FullName || 'N/A',
    email: row.Email || '-',
    telefono: row.Phone || '-',
    especialidad: row.Specialty || '-',
    estado: row.IsActive ? 'Activo' : 'Inactivo',
  }));
}

async function getProgenitoresReport() {
  const result = await query(
    `
    SELECT 
      ProgenitorId,
      FirstName,
      LastName,
      RelationshipType,
      Phone,
      Email,
      DocumentNumber,
      IsEmergencyContact
    FROM Progenitores
    ORDER BY LastName, FirstName
    `
  );

  return (result.recordset || []).map((row: any) => ({
    nombre: `${row.FirstName} ${row.LastName}`,
    relacion: row.RelationshipType,
    telefono: row.Phone || '-',
    email: row.Email || '-',
    documento: row.DocumentNumber || '-',
    emergencia: row.IsEmergencyContact ? 'Sí' : 'No',
  }));
}

async function getAsistenciaReport() {
  const result = await query(
    `
    SELECT 
      au.Name as Aula,
      COUNT(DISTINCT a.AlumnoId) as TotalAlumnos,
      COUNT(DISTINCT CASE WHEN asis.IsPresent = 1 THEN a.AlumnoId END) as Presentes,
      COUNT(DISTINCT CASE WHEN asis.IsPresent = 0 THEN a.AlumnoId END) as Ausentes
    FROM Aulas au
    LEFT JOIN Alumnos a ON au.AulaId = a.AulaId
    LEFT JOIN Asistencia asis ON a.AlumnoId = asis.AlumnoId
    WHERE MONTH(asis.FechaAsistencia) = MONTH(GETDATE())
      AND YEAR(asis.FechaAsistencia) = YEAR(GETDATE())
    GROUP BY au.Name
    ORDER BY au.Name
    `
  );

  return (result.recordset || []).map((row: any) => ({
    aula: row.Aula || 'N/A',
    totalAlumnos: row.TotalAlumnos || 0,
    presentes: row.Presentes || 0,
    ausentes: row.Ausentes || 0,
    porcentaje: row.TotalAlumnos
      ? `${((row.Presentes / row.TotalAlumnos) * 100).toFixed(1)}%`
      : '0%',
  }));
}

async function getInscripcionReport() {
  const result = await query(
    `
    SELECT 
      au.Name,
      au.Capacity,
      COUNT(a.AlumnoId) as Inscritos
    FROM Aulas au
    LEFT JOIN Alumnos a ON au.AulaId = a.AulaId
    GROUP BY au.Name, au.Capacity
    ORDER BY au.Name
    `
  );

  return (result.recordset || []).map((row: any) => ({
    aula: row.Name || 'N/A',
    capacidad: row.Capacity || 0,
    inscritos: row.Inscritos || 0,
    disponible: (row.Capacity - (row.Inscritos || 0)) || 0,
    porcentaje: row.Capacity ? `${((row.Inscritos / row.Capacity) * 100).toFixed(1)}%` : '0%',
  }));
}

const reportGenerators: {
  [key: string]: { data: () => Promise<any[]>; columns: any[] };
} = {
  alumnos: {
    data: getAlumnosReport,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'email', header: 'Email' },
      { key: 'telefono', header: 'Teléfono' },
      { key: 'documento', header: 'Documento' },
      { key: 'fechaNacimiento', header: 'Fecha Nacimiento' },
      { key: 'aula', header: 'Aula' },
      { key: 'estado', header: 'Estado' },
    ],
  },
  maestros: {
    data: getMaestrosReport,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'email', header: 'Email' },
      { key: 'telefono', header: 'Teléfono' },
      { key: 'especialidad', header: 'Especialidad' },
      { key: 'estado', header: 'Estado' },
    ],
  },
  progenitores: {
    data: getProgenitoresReport,
    columns: [
      { key: 'nombre', header: 'Nombre' },
      { key: 'relacion', header: 'Relación' },
      { key: 'telefono', header: 'Teléfono' },
      { key: 'email', header: 'Email' },
      { key: 'documento', header: 'Documento' },
      { key: 'emergencia', header: 'Contacto Emergencia' },
    ],
  },
  asistencia: {
    data: getAsistenciaReport,
    columns: [
      { key: 'aula', header: 'Aula' },
      { key: 'totalAlumnos', header: 'Total Alumnos' },
      { key: 'presentes', header: 'Presentes' },
      { key: 'ausentes', header: 'Ausentes' },
      { key: 'porcentaje', header: 'Porcentaje' },
    ],
  },
  inscripcion: {
    data: getInscripcionReport,
    columns: [
      { key: 'aula', header: 'Aula' },
      { key: 'capacidad', header: 'Capacidad' },
      { key: 'inscritos', header: 'Inscritos' },
      { key: 'disponible', header: 'Disponible' },
      { key: 'porcentaje', header: 'Porcentaje' },
    ],
  },
};

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'alumnos';
    const format = searchParams.get('format') || 'pdf';

    if (!reportGenerators[type]) {
      return NextResponse.json({ error: 'Tipo de reporte no válido' }, { status: 400 });
    }

    const reportConfig = reportGenerators[type];
    const data = await reportConfig.data();

    let buffer: Buffer;
    let contentType: string;

    if (format === 'excel') {
      buffer = await generateExcelReport(
        `Reporte de ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        reportConfig.columns,
        data
      );
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else {
      buffer = await generatePdfReport(
        `Reporte de ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        reportConfig.columns,
        data
      );
      contentType = 'application/pdf';
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="reporte-${type}-${Date.now()}.${format === 'excel' ? 'xlsx' : 'pdf'}"`,
      },
    });
  } catch (error: any) {
    console.error('[v0] Error generating report:', error);
    return NextResponse.json(
      { error: error.message || 'Error al generar el reporte' },
      { status: 500 }
    );
  }
}
