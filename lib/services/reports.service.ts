/**
 * Servicio de Reportes para Catequesis
 * Maneja la generacion de reportes en diferentes formatos
 */

import { mockAlumnos } from '@/lib/mock-data';

/**
 * Genera un CSV con la lista de alumnos
 */
export async function generateAlumnosCSV(): Promise<string> {
  const headers = ['ID', 'Nombre', 'Fecha de Nacimiento', 'Email', 'Telefono', 'Aula'];
  
  const rows = mockAlumnos.map((alumno: any) => [
    alumno.AlumnoId,
    alumno.NombreCompleto,
    alumno.FechaNacimiento,
    alumno.Email || '',
    alumno.Telefono || '',
    alumno.AulaId || '',
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return csv;
}

/**
 * Genera un JSON con reporte de alumnos
 */
export async function generateAlumnosReportJSON(): Promise<object> {
  return {
    title: 'Reporte de Alumnos - Catequesis',
    generatedAt: new Date().toISOString(),
    totalAlumnos: mockAlumnos.length,
    alumnos: mockAlumnos,
  };
}

/**
 * Genera un HTML con reporte de alumnos (para imprimir como PDF desde navegador)
 */
export async function generateAlumnosReportHTML(): Promise<string> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte de Alumnos</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>Reporte de Alumnos - Catequesis</h1>
      <p>Generado: ${new Date().toLocaleDateString('es-ES')}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Fecha de Nacimiento</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Aula</th>
          </tr>
        </thead>
        <tbody>
          ${mockAlumnos
            .map(
              (alumno: any) => `
            <tr>
              <td>${alumno.AlumnoId}</td>
              <td>${alumno.NombreCompleto}</td>
              <td>${alumno.FechaNacimiento}</td>
              <td>${alumno.Email || '-'}</td>
              <td>${alumno.Telefono || '-'}</td>
              <td>${alumno.AulaId || '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>Total de alumnos: ${mockAlumnos.length}</p>
        <p>Documento generado automaticamente por el Sistema de Gestion de Catequesis</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Genera estadisticas generales
 */
export async function generateStatistics(): Promise<object> {
  const totalAlumnos = mockAlumnos.length;
  
  return {
    totalAlumnos,
    reportGeneratedAt: new Date().toISOString(),
    stats: {
      porAula: {},
      porGenero: {},
    },
  };
}
