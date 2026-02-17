/**
 * Servicio de Reportes para Catequesis
 * Maneja la generación de reportes en diferentes formatos
 * En producción, usar librerías como pdfkit y exceljs cuando estén disponibles
 */

import { mockAlumnos } from '@/lib/mock-data';
import { Alumno } from '@/lib/types';

/**
 * Genera un CSV con la lista de alumnos
 */
export async function generateAlumnosCSV(): Promise<string> {
  const headers = ['ID', 'Nombre', 'Fecha de Nacimiento', 'Email', 'Teléfono', 'Aula'];
  
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
            <th>Teléfono</th>
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
        <p>Documento generado automáticamente por el Sistema de Gestión de Catequesis</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Genera estadísticas generales
 */
export async function generateStatistics(): Promise<object> {
  const totalAlumnos = mockAlumnos.length;
  
  return {
    totalAlumnos,
    reportGeneratedAt: new Date().toISOString(),
    stats: {
      porAula: {
        // Agrupar por aula
      },
      porGenero: {
        // Estadísticas de género
      },
    },
  };
}

  const alumnos = await getAlumnosByAula(aulaId);
  const maestro = await getCurrentMaestroOfAula(aulaId);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', reject);

    // Encabezado
    doc.fontSize(20).font('Helvetica-Bold').text('Catequesis - Reporte de Aula', { align: 'center' });
    doc.moveDown(0.5);

    // Información del aula
    doc.fontSize(12).font('Helvetica-Bold').text(`Aula: ${aula.Name}`);
    doc.fontSize(11).font('Helvetica').text(`Nivel: ${aula.Level || 'N/A'}`);
    doc.text(`Capacidad: ${alumnos.length}/${aula.Capacity}`);
    if (maestro) {
      doc.text(`Maestro: ${(maestro as any).UserFullName}`);
    }
    doc.text(`Fecha de reporte: ${new Date().toLocaleDateString('es-ES')}`);
    doc.moveDown(1);

    // Tabla de alumnos
    if (alumnos.length > 0) {
      doc.fontSize(11).font('Helvetica-Bold').text('Lista de Alumnos:');
      doc.moveDown(0.5);

      // Encabezados de tabla
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 300;
      const col3 = 400;
      const rowHeight = 20;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Nº', col1, tableTop);
      doc.text('Nombre y Apellido', col2, tableTop);
      doc.text('Contacto', col3, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Filas de datos
      doc.font('Helvetica').fontSize(9);
      alumnos.forEach((alumno, index) => {
        const y = tableTop + rowHeight * (index + 1);
        if (y > 700) {
          doc.addPage();
          return;
        }
        doc.text(`${index + 1}`, col1, y);
        doc.text(`${alumno.FirstName} ${alumno.LastName}`, col2, y);
        doc.text(alumno.Email || alumno.Phone || '-', col3, y);
      });
    } else {
      doc.fontSize(11).text('No hay alumnos inscritos en esta aula.');
    }

    doc.end();
  });
}

/**
 * Genera un PDF con la información de un alumno y sus progenitores
 */
export async function generateAlumnoReportPDF(alumnoId: number): Promise<Buffer> {
  const alumno = await queryOne<Alumno>(
    'SELECT * FROM Alumnos WHERE AlumnoId = @alumnoId',
    { alumnoId }
  );

  if (!alumno) {
    throw new Error('Alumno no encontrado');
  }

  const progenitores = await getProgenitoresToAlumno(alumnoId);
  const aulas = await query<any>(
    `SELECT DISTINCT a.* FROM Aulas a
     INNER JOIN AlumnoAula aa ON a.AulaId = aa.AulaId
     WHERE aa.AlumnoId = @alumnoId AND a.IsActive = 1`,
    { alumnoId }
  );

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on('error', reject);

    // Encabezado
    doc.fontSize(20).font('Helvetica-Bold').text('Catequesis - Ficha de Alumno', { align: 'center' });
    doc.moveDown(1);

    // Datos del alumno
    doc.fontSize(12).font('Helvetica-Bold').text('Información del Alumno');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Nombre: ${alumno.FirstName} ${alumno.LastName}`);
    if (alumno.DateOfBirth) {
      doc.text(`Fecha de Nacimiento: ${new Date(alumno.DateOfBirth).toLocaleDateString('es-ES')}`);
    }
    if (alumno.DocumentNumber) {
      doc.text(`Documento: ${alumno.DocumentType} - ${alumno.DocumentNumber}`);
    }
    if (alumno.Address) {
      doc.text(`Domicilio: ${alumno.Address}, ${alumno.City || ''} ${alumno.PostalCode || ''}`);
    }
    if (alumno.Phone) {
      doc.text(`Teléfono: ${alumno.Phone}`);
    }
    if (alumno.Email) {
      doc.text(`Email: ${alumno.Email}`);
    }
    if (alumno.SpecialNeeds) {
      doc.text(`Necesidades Especiales: ${alumno.SpecialNeeds}`);
    }
    if (alumno.MedicalInfo) {
      doc.text(`Información Médica: ${alumno.MedicalInfo}`);
    }

    doc.moveDown(1);

    // Progenitores
    doc.fontSize(12).font('Helvetica-Bold').text('Contactos (Progenitores/Tutores)');
    if (progenitores.length > 0) {
      doc.fontSize(10).font('Helvetica');
      progenitores.forEach((prog, index) => {
        doc.text(`${index + 1}. ${prog.FirstName} ${prog.LastName} (${prog.RelationshipType})`);
        if (prog.Phone) doc.text(`   Teléfono: ${prog.Phone}`);
        if (prog.WorkPhone) doc.text(`   Teléfono Laboral: ${prog.WorkPhone}`);
        if (prog.Email) doc.text(`   Email: ${prog.Email}`);
        if (prog.IsEmergencyContact) doc.text(`   Contacto de Emergencia: SÍ`);
        doc.moveDown(0.3);
      });
    } else {
      doc.fontSize(10).text('No hay contactos registrados.');
    }

    doc.moveDown(1);

    // Aulas inscritas
    if (aulas.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Aulas Inscritas');
      doc.fontSize(10).font('Helvetica');
      aulas.forEach((aula) => {
        doc.text(`- ${aula.Name} (${aula.Level || 'N/A'})`);
      });
    }

    doc.end();
  });
}

/**
 * Genera un archivo Excel con la lista de alumnos de una aula
 */
export async function generateAulaReportExcel(aulaId: number): Promise<Buffer> {
  const aula = await getAulaById(aulaId);
  if (!aula) {
    throw new Error('Aula no encontrada');
  }

  const alumnos = await getAlumnosByAula(aulaId);
  const maestro = await getCurrentMaestroOfAula(aulaId);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Alumnos');

  // Encabezados
  worksheet.columns = [
    { header: 'Nº', key: 'numero', width: 5 },
    { header: 'Nombre', key: 'firstName', width: 15 },
    { header: 'Apellido', key: 'lastName', width: 15 },
    { header: 'Documento', key: 'documentNumber', width: 15 },
    { header: 'Teléfono', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 20 },
    { header: 'Dirección', key: 'address', width: 25 },
    { header: 'Ciudad', key: 'city', width: 15 },
  ];

  // Fila de información del aula
  worksheet.insertRows(1, [
    { numero: `Aula: ${aula.Name}`, firstName: '', lastName: '', documentNumber: '', phone: '', email: '', address: '', city: '' },
    { numero: `Nivel: ${aula.Level || 'N/A'}`, firstName: '', lastName: '', documentNumber: '', phone: '', email: '', address: '', city: '' },
    { numero: `Maestro: ${(maestro as any)?.UserFullName || 'No asignado'}`, firstName: '', lastName: '', documentNumber: '', phone: '', email: '', address: '', city: '' },
    { numero: `Fecha: ${new Date().toLocaleDateString('es-ES')}`, firstName: '', lastName: '', documentNumber: '', phone: '', email: '', address: '', city: '' },
  ]);

  // Datos de alumnos
  alumnos.forEach((alumno, index) => {
    worksheet.addRow({
      numero: index + 1,
      firstName: alumno.FirstName,
      lastName: alumno.LastName,
      documentNumber: alumno.DocumentNumber || '',
      phone: alumno.Phone || '',
      email: alumno.Email || '',
      address: alumno.Address || '',
      city: alumno.City || '',
    });
  });

  // Estilos
  worksheet.getRow(5).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } };

  // Generar buffer
  return await workbook.xlsx.writeBuffer() as Buffer;
}

/**
 * Genera un archivo Excel con información de alumnos y sus progenitores
 */
export async function generateAlumnoContactExcel(aulaId: number): Promise<Buffer> {
  const aula = await getAulaById(aulaId);
  if (!aula) {
    throw new Error('Aula no encontrada');
  }

  const alumnos = await getAlumnosByAula(aulaId);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Contactos');

  worksheet.columns = [
    { header: 'Alumno', key: 'alumno', width: 20 },
    { header: 'Progenitor', key: 'progenitor', width: 20 },
    { header: 'Relación', key: 'relacion', width: 12 },
    { header: 'Teléfono', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 20 },
    { header: 'Emergencia', key: 'emergencia', width: 12 },
  ];

  // Recopilar datos
  for (const alumno of alumnos) {
    const progenitores = await getProgenitoresToAlumno(alumno.AlumnoId);

    if (progenitores.length > 0) {
      progenitores.forEach((prog, index) => {
        worksheet.addRow({
          alumno: index === 0 ? `${alumno.FirstName} ${alumno.LastName}` : '',
          progenitor: `${prog.FirstName} ${prog.LastName}`,
          relacion: prog.RelationshipType,
          phone: prog.Phone || '',
          email: prog.Email || '',
          emergencia: prog.IsEmergencyContact ? 'SÍ' : '',
        });
      });
    } else {
      worksheet.addRow({
        alumno: `${alumno.FirstName} ${alumno.LastName}`,
        progenitor: 'Sin contacto registrado',
        relacion: '',
        phone: '',
        email: '',
        emergencia: '',
      });
    }
  }

  // Estilos
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } };

  return await workbook.xlsx.writeBuffer() as Buffer;
}

/**
 * Genera un archivo Excel con asistencia de una aula
 */
export async function generateAttendanceReportExcel(
  aulaId: number,
  startDate: Date,
  endDate: Date
): Promise<Buffer> {
  const aula = await getAulaById(aulaId);
  if (!aula) {
    throw new Error('Aula no encontrada');
  }

  const alumnos = await getAlumnosByAula(aulaId);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Asistencia');

  // Obtener fechas de clases
  const asistenciaData = await query<any>(
    `SELECT DISTINCT FechaClase FROM Asistencia 
     WHERE AulaId = @aulaId AND FechaClase BETWEEN @startDate AND @endDate
     ORDER BY FechaClase`,
    { aulaId, startDate, endDate }
  );

  const fechas = asistenciaData.map((d: any) => new Date(d.FechaClase));

  // Crear encabezados dinámicos con las fechas
  const columns: any[] = [{ header: 'Alumno', key: 'alumno', width: 20 }];
  fechas.forEach((fecha, index) => {
    columns.push({
      header: fecha.toLocaleDateString('es-ES'),
      key: `fecha_${index}`,
      width: 12,
    });
  });
  columns.push({ header: 'Total', key: 'total', width: 8 });

  worksheet.columns = columns;

  // Agregar datos
  alumnos.forEach((alumno) => {
    const row: any = { alumno: `${alumno.FirstName} ${alumno.LastName}` };
    let totalAsistencias = 0;

    fechas.forEach((fecha, index) => {
      // Aquí iría la lógica para obtener la asistencia específica
      row[`fecha_${index}`] = '✓'; // Placeholder
      totalAsistencias++;
    });

    row.total = totalAsistencias;
    worksheet.addRow(row);
  });

  // Estilos
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF366092' } };

  return await workbook.xlsx.writeBuffer() as Buffer;
}
