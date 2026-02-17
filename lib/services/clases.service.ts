/**
 * Servicio de Gestión de Clases
 * Una Clase pertenece a un Curso y contiene Alumnos
 */

import { mockClases, mockAlumnos } from '@/lib/mock-data';
import { Clase, CreateClaseRequest, UpdateClaseRequest } from '@/lib/types';

/**
 * Obtiene todas las clases, opcionalmente filtradas por curso
 */
export async function getAllClases(cursoId?: number): Promise<Clase[]> {
  let clases = [...mockClases];
  
  if (cursoId) {
    clases = clases.filter(c => c.CursoId === cursoId);
  }
  
  return clases;
}

/**
 * Obtiene una clase por ID
 */
export async function getClaseById(claseId: number): Promise<Clase | null> {
  const clase = mockClases.find(c => c.ClaseId === claseId);
  
  if (clase) {
    return {
      ...clase,
      Alumnos: mockAlumnos.filter(a => a.ClaseId === claseId)
    };
  }
  
  return null;
}

/**
 * Obtiene los alumnos de una clase
 */
export async function getAlumnosByClase(claseId: number) {
  return mockAlumnos.filter(a => a.ClaseId === claseId);
}

/**
 * Crea una nueva clase
 */
export async function createClase(data: CreateClaseRequest): Promise<Clase> {
  const newClaseId = Math.max(...mockClases.map(c => c.ClaseId || 0)) + 1;
  
  const newClase: Clase = {
    ClaseId: newClaseId,
    CursoId: data.CursoId,
    Nombre: data.Nombre,
    MaestroId: data.MaestroId,
    CapacidadMaxima: data.MaxCapacidad || 30,
    IsActive: true,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  };
  
  mockClases.push(newClase);
  return newClase;
}

/**
 * Actualiza una clase
 */
export async function updateClase(claseId: number, data: UpdateClaseRequest): Promise<Clase | null> {
  const clase = mockClases.find(c => c.ClaseId === claseId);
  
  if (!clase) {
    return null;
  }
  
  if (data.Nombre) clase.Nombre = data.Nombre;
  if (data.MaestroId !== undefined) clase.MaestroId = data.MaestroId;
  if (data.MaxCapacidad) clase.CapacidadMaxima = data.MaxCapacidad;
  
  clase.UpdatedAt = new Date();
  
  return clase;
}

/**
 * Elimina una clase
 */
export async function deleteClase(claseId: number): Promise<void> {
  const index = mockClases.findIndex(c => c.ClaseId === claseId);
  
  if (index !== -1) {
    mockClases.splice(index, 1);
  }
  
  // También desasociar alumnos
  mockAlumnos.forEach(a => {
    if (a.ClaseId === claseId) {
      a.ClaseId = undefined;
    }
  });
}

/**
 * Busca clases por nombre
 */
export async function searchClases(query: string): Promise<Clase[]> {
  return mockClases.filter(c => 
    c.Nombre.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Cuenta el número de alumnos en una clase
 */
export async function getAlumnosCountByClase(claseId: number): Promise<number> {
  return mockAlumnos.filter(a => a.ClaseId === claseId).length;
}

/**
 * Obtiene el porcentaje de capacidad de una clase
 */
export async function getClaseCapacityPercentage(claseId: number): Promise<number> {
  const clase = mockClases.find(c => c.ClaseId === claseId);
  if (!clase) return 0;
  
  const count = mockAlumnos.filter(a => a.ClaseId === claseId).length;
  return (count / clase.CapacidadMaxima) * 100;
}
