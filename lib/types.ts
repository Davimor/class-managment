// Tipos para la base de datos - Catequesis
// Estructura: Curso -> Clase -> Alumnos

export interface Curso {
  CursoId: number;
  Nombre: string;
  Tipo: 'fundamentacion' | 'pedagogia' | 'dogmatico';
  Descripcion?: string;
  Contenido?: string;
  Duracion?: number; // en horas
  AñoAcademico: number; // ej: 2024, 2025
  IsActive: boolean;
  IsDummy: boolean; // Para cursos template del próximo año
  CreatedAt: Date;
  UpdatedAt: Date;
  Clases?: Clase[];
}

export interface Clase {
  ClaseId: number;
  CursoId: number;
  Nombre: string; // ej: "1A", "1B", "2A"
  MaestroId?: number;
  MaxCapacidad: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Curso?: Curso;
  Maestro?: Maestro;
  Alumnos?: Alumno[];
}

export interface User {
  UserId: number;
  Email: string;
  PasswordHash: string;
  FullName: string;
  Role: 'admin' | 'maestro' | 'secretaria';
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Aula {
  AulaId: number;
  Name: string;
  Description?: string;
  Level?: string;
  Capacity: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Maestro {
  MaestroId: number;
  UserId: number;
  Phone?: string;
  Specialty?: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  User?: User;
}

export interface MaestroAula {
  MaestroAulaId: number;
  MaestroId: number;
  AulaId: number;
  StartDate: Date;
  EndDate?: Date;
  IsActive: boolean;
  CreatedAt: Date;
  Maestro?: Maestro;
  Aula?: Aula;
}

export interface Alumno {
  AlumnoId: number;
  NombreCompleto: string;
  FechaNacimiento?: Date;
  Genero?: string;
  TipoDocumento?: string;
  NumeroDocumento?: string;
  Direccion?: string;
  Ciudad?: string;
  CodigoPostal?: string;
  Telefono?: string;
  Email?: string;
  NecesidadesEspeciales?: string;
  InfoMedica?: string;
  ClaseId?: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Progenitores?: Progenitor[];
  Clase?: Clase;
}

export interface Progenitor {
  ProgenitorId: number;
  NombreCompleto: string;
  TipoRelacion: 'padre' | 'madre' | 'tutor' | 'otro';
  TipoDocumento?: string;
  NumeroDocumento?: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  Ciudad?: string;
  CodigoPostal?: string;
  EsContactoEmergencia: boolean;
  AlumnoId: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Alumno?: Alumno;
}

export interface Asistencia {
  AsistenciaId: number;
  AlumnoId: number;
  ClaseId: number;
  FechaClase: Date;
  Presente: boolean;
  Justificacion?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Alumno?: Alumno;
  Clase?: Clase;
}

export interface Calificacion {
  CalificacionId: number;
  AlumnoId: number;
  ClaseId: number;
  Trimestre: string; // 'T1', 'T2', 'T3', 'T4'
  Puntuacion?: number;
  Comentarios?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Alumno?: Alumno;
  Clase?: Clase;
}

// Request DTOs

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateCursoRequest {
  Nombre: string;
  Tipo: 'fundamentacion' | 'pedagogia' | 'dogmatico';
  Descripcion?: string;
  Contenido?: string;
  Duracion?: number;
  AñoAcademico: number;
  IsDummy?: boolean;
}

export interface UpdateCursoRequest extends Partial<CreateCursoRequest> {}

export interface CreateClaseRequest {
  CursoId: number;
  Nombre: string;
  MaestroId?: number;
  MaxCapacidad: number;
}

export interface UpdateClaseRequest extends Partial<CreateClaseRequest> {}

export interface CreateAlumnoRequest {
  NombreCompleto: string;
  FechaNacimiento?: Date;
  Genero?: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  ClaseId?: number;
}

export interface UpdateAlumnoRequest extends Partial<CreateAlumnoRequest> {}

export interface CreateProgenitorRequest {
  NombreCompleto: string;
  TipoRelacion: 'padre' | 'madre' | 'tutor' | 'otro';
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  EsContactoEmergencia?: boolean;
  AlumnoId: number;
}

export interface UpdateProgenitorRequest extends Partial<CreateProgenitorRequest> {}
  PostalCode?: string;
  Occupation?: string;
  WorkPhone?: string;
  IsEmergencyContact: boolean;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface AlumnoProgenitor {
  AlumnoProgenitorId: number;
  AlumnoId: number;
  ProgenitorId: number;
  IsPrimaryContact: boolean;
  CreatedAt: Date;
}

export interface AlumnoAula {
  AlumnoAulaId: number;
  AlumnoId: number;
  AulaId: number;
  EnrollmentDate: Date;
  WithdrawalDate?: Date;
  Status: 'activo' | 'completado' | 'retirado';
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Asistencia {
  AsistenciaId: number;
  AlumnoId: number;
  AulaId: number;
  FechaClase: Date;
  Presente: boolean;
  Justificada: boolean;
  Observaciones?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Calificacion {
  CalificacionId: number;
  AlumnoId: number;
  AulaId: number;
  Quarter: string;
  Score?: number;
  Comments?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface Curso {
  CursoId: number;
  Nombre: string;
  Tipo: 'fundamentacion' | 'pedagogia' | 'dogmatico';
  Descripcion?: string;
  Contenido?: string;
  MaestroId?: number;
  Duracion?: number; // en horas
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Maestro?: Maestro;
  Alumnos?: Alumno[];
}

export interface AlumnoCurso {
  AlumnoCursoId: number;
  AlumnoId: number;
  CursoId: number;
  FechaInscripcion: Date;
  FechaFinalizacion?: Date;
  Calificacion?: number;
  Estado: 'inscrito' | 'completado' | 'abandonado';
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}

// DTOs para peticiones de API
export interface CreateUserRequest {
  Email: string;
  Password: string;
  FullName: string;
  Role: 'admin' | 'maestro' | 'secretaria';
}

export interface UpdateUserRequest {
  FullName?: string;
  Email?: string;
  Role?: 'admin' | 'maestro' | 'secretaria';
  IsActive?: boolean;
}

export interface CreateAlumnoRequest {
  FirstName: string;
  LastName: string;
  DateOfBirth?: Date;
  Gender?: string;
  DocumentType?: string;
  DocumentNumber?: string;
  Address?: string;
  City?: string;
  PostalCode?: string;
  Phone?: string;
  Email?: string;
  SpecialNeeds?: string;
  MedicalInfo?: string;
}

export interface UpdateAlumnoRequest extends Partial<CreateAlumnoRequest> {}

export interface CreateProgenitorRequest {
  FirstName: string;
  LastName: string;
  RelationshipType: 'padre' | 'madre' | 'tutor' | 'otro';
  DocumentType?: string;
  DocumentNumber?: string;
  Phone?: string;
  Email?: string;
  Address?: string;
  City?: string;
  PostalCode?: string;
  Occupation?: string;
  WorkPhone?: string;
  IsEmergencyContact?: boolean;
}

export interface UpdateProgenitorRequest extends Partial<CreateProgenitorRequest> {}

export interface CreateAulaRequest {
  Name: string;
  Description?: string;
  Level?: string;
  Capacity?: number;
}

export interface UpdateAulaRequest extends Partial<CreateAulaRequest> {}

export interface CreateMaestroRequest {
  UserId: number;
  Phone?: string;
  Specialty?: string;
}

export interface UpdateMaestroRequest extends Partial<CreateMaestroRequest> {}

// Respuesta de autenticación
export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateCursoRequest {
  Nombre: string;
  Tipo: 'fundamentacion' | 'pedagogia' | 'dogmatico';
  Descripcion?: string;
  Contenido?: string;
  MaestroId?: number;
  Duracion?: number;
}

export interface UpdateCursoRequest extends Partial<CreateCursoRequest> {}

export interface CreateAlumnoCursoRequest {
  AlumnoId: number;
  CursoId: number;
}

export interface UpdateAlumnoCursoRequest {
  Calificacion?: number;
  Estado?: 'inscrito' | 'completado' | 'abandonado';
}
