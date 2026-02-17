/**
 * Servicio para gestión de Cursos
 */

'use server';

import { query, queryOne } from '@/lib/db';
import { Curso, AlumnoCurso, CreateCursoRequest, UpdateCursoRequest } from '@/lib/types';
import { mockCursos } from '@/lib/mock-data';

/**
 * Obtiene todos los cursos
 */
export async function getAllCursos(): Promise<Curso[]> {
  try {
    return mockCursos;
  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    throw error;
  }
}

/**
 * Obtiene un curso por ID
 */
export async function getCursoById(cursoId: number): Promise<Curso | null> {
  try {
    return mockCursos.find((c: any) => c.CursoId === cursoId) || null;
  } catch (error) {
    console.error('Error obteniendo curso:', error);
    throw error;
  }
}

/**
 * Obtiene cursos por tipo
 */
export async function getCursosByTipo(tipo: 'fundamentacion' | 'pedagogia' | 'dogmatico'): Promise<Curso[]> {
  try {
    return mockCursos.filter((c: any) => c.Tipo === tipo);
  } catch (error) {
    console.error('Error obteniendo cursos por tipo:', error);
    throw error;
  }
}

/**
 * Crea un nuevo curso
 */
export async function createCurso(data: CreateCursoRequest): Promise<Curso> {
  try {
    const newCurso: Curso = {
      CursoId: Math.max(...mockCursos.map((c: any) => c.CursoId || 0)) + 1,
      ...data,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    mockCursos.push(newCurso);
    return newCurso;
  } catch (error) {
    console.error('Error creando curso:', error);
    throw error;
  }
}

/**
 * Actualiza un curso
 */
export async function updateCurso(cursoId: number, data: UpdateCursoRequest): Promise<Curso | null> {
  try {
    const curso = mockCursos.find((c: any) => c.CursoId === cursoId);
    if (!curso) return null;

    Object.assign(curso, data, { UpdatedAt: new Date() });
    return curso;
  } catch (error) {
    console.error('Error actualizando curso:', error);
    throw error;
  }
}

/**
 * Elimina un curso
 */
export async function deleteCurso(cursoId: number): Promise<boolean> {
  try {
    const index = mockCursos.findIndex((c: any) => c.CursoId === cursoId);
    if (index === -1) return false;

    mockCursos.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Error eliminando curso:', error);
    throw error;
  }
}

/**
 * Busca cursos por nombre
 */
export async function searchCursos(query: string): Promise<Curso[]> {
  try {
    return mockCursos.filter((c: any) =>
      c.Nombre.toLowerCase().includes(query.toLowerCase()) ||
      c.Descripcion?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error buscando cursos:', error);
    throw error;
  }
}

export default {
  getAllCursos,
  getCursoById,
  getCursosByTipo,
  createCurso,
  updateCurso,
  deleteCurso,
  searchCursos,
};
