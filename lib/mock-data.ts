// Datos de prueba para desarrollo - Estructura: Curso -> Clase -> Alumnos

export const mockUsers = [
  {
    UserId: 1,
    Email: 'admin@parroquia.local',
    PasswordHash: 'hashed_admin_password',
    Role: 'admin',
    NombreCompleto: 'Administrador Sistema',
    CreatedAt: new Date(),
  },
  {
    UserId: 2,
    Email: 'maestro1@parroquia.local',
    PasswordHash: 'hashed_maestro_password',
    Role: 'maestro',
    NombreCompleto: 'Fr. Juan García',
    CreatedAt: new Date(),
  },
  {
    UserId: 3,
    Email: 'secretaria@parroquia.local',
    PasswordHash: 'hashed_secretaria_password',
    Role: 'secretaria',
    NombreCompleto: 'María Rodríguez',
    CreatedAt: new Date(),
  },
];

export const mockMaestros = [
  {
    MaestroId: 1,
    UserId: 2,
    Telefono: '600555555',
    Especialidad: 'Catequesis Infantil',
    IsActive: true,
    CreatedAt: new Date(),
  },
];

// Cursos con estructura: Curso (tipo) -> Clases -> Alumnos
export const mockCursos = [
  {
    CursoId: 1,
    Nombre: 'Nivel 1',
    Tipo: 'fundamentacion',
    Descripcion: 'Primer año de catequesis',
    Contenido: 'Introducción a la fe cristiana y principios básicos',
    Duracion: 40,
    AñoAcademico: 2024,
    IsDummy: false,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    CursoId: 2,
    Nombre: 'Nivel 2',
    Tipo: 'pedagogia',
    Descripcion: 'Segundo año de catequesis',
    Contenido: 'Profundización en metodologías de enseñanza',
    Duracion: 36,
    AñoAcademico: 2024,
    IsDummy: false,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    CursoId: 3,
    Nombre: 'Nivel 3',
    Tipo: 'dogmatico',
    Descripcion: 'Tercer año de catequesis',
    Contenido: 'Contenido dogmático y vida espiritual',
    Duracion: 44,
    AñoAcademico: 2024,
    IsDummy: false,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    CursoId: 4,
    Nombre: 'Nivel 1 - 2025',
    Tipo: 'fundamentacion',
    Descripcion: 'Template para el próximo año',
    Contenido: 'Será poblado en septiembre',
    Duracion: 40,
    AñoAcademico: 2025,
    IsDummy: true,
    IsActive: true,
    CreatedAt: new Date(),
  },
];

// Clases dentro de cada Curso (1A, 1B, 2A, 2B, 2C, etc)
export const mockClases = [
  // Nivel 1 - Clases 1A y 1B
  {
    ClaseId: 1,
    CursoId: 1,
    Nombre: '1A',
    MaestroId: 1,
    CapacidadMaxima: 20,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    ClaseId: 2,
    CursoId: 1,
    Nombre: '1B',
    MaestroId: 1,
    CapacidadMaxima: 18,
    IsActive: true,
    CreatedAt: new Date(),
  },
  // Nivel 2 - Clases 2A y 2B
  {
    ClaseId: 3,
    CursoId: 2,
    Nombre: '2A',
    MaestroId: 1,
    CapacidadMaxima: 20,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    ClaseId: 4,
    CursoId: 2,
    Nombre: '2B',
    MaestroId: 1,
    CapacidadMaxima: 18,
    IsActive: true,
    CreatedAt: new Date(),
  },
  // Nivel 3 - Clases 3A, 3B y 3C
  {
    ClaseId: 5,
    CursoId: 3,
    Nombre: '3A',
    MaestroId: 1,
    CapacidadMaxima: 15,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    ClaseId: 6,
    CursoId: 3,
    Nombre: '3B',
    MaestroId: 1,
    CapacidadMaxima: 17,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    ClaseId: 7,
    CursoId: 3,
    Nombre: '3C',
    MaestroId: 1,
    CapacidadMaxima: 16,
    IsActive: true,
    CreatedAt: new Date(),
  },
];

// Alumnos inscritos en las clases
export const mockAlumnos = [
  // Alumnos en 1A
  {
    AlumnoId: 1,
    NombreCompleto: 'Carlos Pérez García',
    FechaNacimiento: new Date('2015-05-15'),
    Genero: 'M',
    Direccion: 'Calle Principal 123',
    Telefono: '600123456',
    Email: 'carlos.perez@example.com',
    ClaseId: 1, // 1A
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    AlumnoId: 2,
    NombreCompleto: 'Ana López Martínez',
    FechaNacimiento: new Date('2015-08-20'),
    Genero: 'F',
    Direccion: 'Avenida Central 456',
    Telefono: '600234567',
    Email: 'ana.lopez@example.com',
    ClaseId: 1, // 1A
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    AlumnoId: 3,
    NombreCompleto: 'Miguel Rodríguez Fernández',
    FechaNacimiento: new Date('2015-11-10'),
    Genero: 'M',
    Direccion: 'Calle Verde 789',
    Telefono: '600345678',
    Email: 'miguel.rodriguez@example.com',
    ClaseId: 2, // 1B
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    AlumnoId: 4,
    NombreCompleto: 'Isabel García Moreno',
    FechaNacimiento: new Date('2015-02-25'),
    Genero: 'F',
    Direccion: 'Calle Azul 321',
    Telefono: '600456789',
    Email: 'isabel.garcia@example.com',
    ClaseId: 2, // 1B
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    AlumnoId: 5,
    NombreCompleto: 'David Sánchez López',
    FechaNacimiento: new Date('2014-07-08'),
    Genero: 'M',
    Direccion: 'Calle Roja 654',
    Telefono: '600567890',
    Email: 'david.sanchez@example.com',
    ClaseId: 3, // 2A
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    AlumnoId: 6,
    NombreCompleto: 'Sofía Martínez González',
    FechaNacimiento: new Date('2014-09-12'),
    Genero: 'F',
    Direccion: 'Calle Naranja 987',
    Telefono: '600678901',
    Email: 'sofia.martinez@example.com',
    ClaseId: 3, // 2A
    IsActive: true,
    CreatedAt: new Date(),
  },
];

// Progenitores asociados a alumnos
export const mockProgenitores = [
  {
    ProgenitorId: 1,
    AlumnoId: 1, // Carlos
    NombreCompleto: 'Pedro Pérez Rodríguez',
    TipoRelacion: 'padre',
    Email: 'pedro.perez@example.com',
    Telefono: '600111111',
    Direccion: 'Calle Principal 123',
    EsContactoEmergencia: false,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    ProgenitorId: 2,
    AlumnoId: 1, // Carlos
    NombreCompleto: 'Rosa García López',
    TipoRelacion: 'madre',
    Email: 'rosa.garcia@example.com',
    Telefono: '600111112',
    Direccion: 'Calle Principal 123',
    EsContactoEmergencia: true,
    IsActive: true,
    CreatedAt: new Date(),
  },
  {
    ProgenitorId: 3,
    AlumnoId: 2, // Ana
    NombreCompleto: 'Juan López Martínez',
    TipoRelacion: 'padre',
    Email: 'juan.lopez@example.com',
    Telefono: '600222222',
    Direccion: 'Avenida Central 456',
    EsContactoEmergencia: false,
    IsActive: true,
    CreatedAt: new Date(),
  },
];
