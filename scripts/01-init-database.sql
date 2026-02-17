-- =====================================================
-- Script de Inicialización - Base de Datos Catequesis
-- Estructura: Curso -> Clase -> Alumnos
-- =====================================================

-- Crear tabla de Usuarios (Admin, Maestros, Secretaría)
CREATE TABLE Usuarios (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    NombreCompleto NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL, -- 'admin', 'maestro', 'secretaria'
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Crear tabla de Maestros (Catequistas)
CREATE TABLE Maestros (
    MaestroId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL UNIQUE,
    Telefono NVARCHAR(20),
    Especialidad NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Usuarios(UserId)
);

-- Crear tabla de Cursos (Fundamentación, Pedagogía, Contenido Dogmático)
CREATE TABLE Cursos (
    CursoId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL,
    Tipo NVARCHAR(50) NOT NULL, -- 'fundamentacion', 'pedagogia', 'dogmatico'
    Descripcion NVARCHAR(1000),
    Contenido NVARCHAR(MAX),
    Duracion INT, -- en horas
    AñoAcademico INT NOT NULL, -- 2024, 2025, etc
    IsDummy BIT DEFAULT 0, -- Para cursos template del próximo año
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX idx_curso_tipo ON Cursos(Tipo);
CREATE INDEX idx_curso_año ON Cursos(AñoAcademico);
CREATE INDEX idx_curso_dummy ON Cursos(IsDummy);

-- Crear tabla de Clases (1A, 1B, 2A, 2B, 2C, etc)
CREATE TABLE Clases (
    ClaseId INT PRIMARY KEY IDENTITY(1,1),
    CursoId INT NOT NULL,
    Nombre NVARCHAR(50) NOT NULL, -- '1A', '1B', '2A', '2B', '2C', etc
    MaestroId INT,
    CapacidadMaxima INT DEFAULT 30,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CursoId) REFERENCES Cursos(CursoId),
    FOREIGN KEY (MaestroId) REFERENCES Maestros(MaestroId),
    UNIQUE(CursoId, Nombre)
);

CREATE INDEX idx_clase_curso ON Clases(CursoId);
CREATE INDEX idx_clase_maestro ON Clases(MaestroId);

-- Crear tabla de Alumnos
CREATE TABLE Alumnos (
    AlumnoId INT PRIMARY KEY IDENTITY(1,1),
    NombreCompleto NVARCHAR(255) NOT NULL,
    FechaNacimiento DATE,
    Genero NVARCHAR(20),
    TipoDocumento NVARCHAR(20),
    NumeroDocumento NVARCHAR(50),
    Direccion NVARCHAR(500),
    Ciudad NVARCHAR(100),
    CodigoPostal NVARCHAR(10),
    Telefono NVARCHAR(20),
    Email NVARCHAR(255),
    NecesidadesEspeciales NVARCHAR(500),
    InfoMedica NVARCHAR(500),
    ClaseId INT, -- FK a la clase donde está inscrito
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ClaseId) REFERENCES Clases(ClaseId)
);

CREATE INDEX idx_alumno_clase ON Alumnos(ClaseId);
CREATE INDEX idx_alumno_nombre ON Alumnos(NombreCompleto);

-- Crear tabla de Progenitores (Padres/Tutores)
CREATE TABLE Progenitores (
    ProgenitorId INT PRIMARY KEY IDENTITY(1,1),
    AlumnoId INT NOT NULL,
    NombreCompleto NVARCHAR(255) NOT NULL,
    TipoRelacion NVARCHAR(50), -- 'padre', 'madre', 'tutor', 'otro'
    TipoDocumento NVARCHAR(20),
    NumeroDocumento NVARCHAR(50),
    Telefono NVARCHAR(20),
    Email NVARCHAR(255),
    Direccion NVARCHAR(500),
    Ciudad NVARCHAR(100),
    CodigoPostal NVARCHAR(10),
    EsContactoEmergencia BIT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (AlumnoId) REFERENCES Alumnos(AlumnoId) ON DELETE CASCADE
);

CREATE INDEX idx_progenitor_alumno ON Progenitores(AlumnoId);

-- Crear tabla de Asistencia
CREATE TABLE Asistencia (
    AsistenciaId INT PRIMARY KEY IDENTITY(1,1),
    AlumnoId INT NOT NULL,
    ClaseId INT NOT NULL,
    FechaClase DATE NOT NULL,
    Presente BIT,
    Justificacion NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (AlumnoId) REFERENCES Alumnos(AlumnoId),
    FOREIGN KEY (ClaseId) REFERENCES Clases(ClaseId),
    UNIQUE(AlumnoId, ClaseId, FechaClase)
);

CREATE INDEX idx_asistencia_fecha ON Asistencia(FechaClase);
CREATE INDEX idx_asistencia_alumno ON Asistencia(AlumnoId);

-- Crear tabla de Calificaciones
CREATE TABLE Calificaciones (
    CalificacionId INT PRIMARY KEY IDENTITY(1,1),
    AlumnoId INT NOT NULL,
    ClaseId INT NOT NULL,
    Trimestre NVARCHAR(50), -- 'T1', 'T2', 'T3', 'T4'
    Puntuacion DECIMAL(5,2),
    Comentarios NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (AlumnoId) REFERENCES Alumnos(AlumnoId),
    FOREIGN KEY (ClaseId) REFERENCES Clases(ClaseId),
    UNIQUE(AlumnoId, ClaseId, Trimestre)
);

CREATE INDEX idx_calificacion_alumno ON Calificaciones(AlumnoId);

-- Crear tabla de Aulas (para referencia física - opcional)
CREATE TABLE Aulas (
    AulaId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Ubicacion NVARCHAR(255),
    CapacidadMaxima INT,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Crear usuario administrador por defecto
INSERT INTO Usuarios (Email, PasswordHash, NombreCompleto, Role, IsActive)
VALUES (
    'admin@parroquia.local',
    '$2b$10$placeholder_hash_must_be_replaced_with_real_hash',
    'Administrador',
    'admin',
    1
);

-- =====================================================
-- FIN DEL SCRIPT DE INICIALIZACIÓN
-- ====================================================="
