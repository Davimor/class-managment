import {
  Aula,
  Maestro,
  MaestroAula,
  CreateAulaRequest,
  UpdateAulaRequest,
  CreateMaestroRequest,
  UpdateMaestroRequest,
  User,
} from '@/lib/types';
import { mockAulas, mockMaestros } from '@/lib/mock-data';

// ========== SERVICIOS PARA AULAS (Mock Data Only) ==========

export async function getAllAulas(onlyActive: boolean = true): Promise<Aula[]> {
  return mockAulas.filter(a => !onlyActive || a.IsActive);
}

export async function getAulaById(aulaId: number): Promise<Aula | null> {
  return mockAulas.find(a => a.AulaId === aulaId) || null;
}

export async function getAulaAvailableCapacity(aulaId: number): Promise<number> {
  const aula = mockAulas.find(a => a.AulaId === aulaId);
  if (!aula) throw new Error('Aula no encontrada');
  return aula.Capacity || 30;
}

export async function searchAulas(searchTerm: string): Promise<Aula[]> {
  const term = searchTerm.toLowerCase();
  return mockAulas.filter(a => 
    a.IsActive && (
      a.Name?.toLowerCase().includes(term) ||
      a.Description?.toLowerCase().includes(term)
    )
  );
}

export async function createAula(request: CreateAulaRequest): Promise<Aula> {
  const aula: Aula = {
    AulaId: Math.max(...mockAulas.map(a => a.AulaId || 0)) + 1,
    Name: request.Name,
    Description: request.Description,
    Capacity: request.Capacity || 30,
    IsActive: true,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
  };
  mockAulas.push(aula);
  return aula;
}

export async function updateAula(aulaId: number, request: UpdateAulaRequest): Promise<Aula> {
  const aula = mockAulas.find(a => a.AulaId === aulaId);
  if (!aula) throw new Error('Aula no encontrada');
  
  if (request.Name) aula.Name = request.Name;
  if (request.Description !== undefined) aula.Description = request.Description;
  if (request.Capacity) aula.Capacity = request.Capacity;
  aula.UpdatedAt = new Date();
  return aula;
}

export async function deleteAula(aulaId: number): Promise<void> {
  const aula = mockAulas.find(a => a.AulaId === aulaId);
  if (aula) aula.IsActive = false;
}

// ========== SERVICIOS PARA MAESTROS (Mock Data Only) ==========

export async function getAllMaestros(onlyActive: boolean = true): Promise<(Maestro & { User?: User })[]> {
  return mockMaestros.filter(m => !onlyActive || m.IsActive) as (Maestro & { User?: User })[];
}

export async function getMaestroById(maestroId: number): Promise<(Maestro & { User?: User }) | null> {
  return mockMaestros.find(m => m.MaestroId === maestroId) as (Maestro & { User?: User }) || null;
}

export async function getMaestroByUserId(userId: number): Promise<(Maestro & { User?: User }) | null> {
  return mockMaestros.find(m => m.UserId === userId) as (Maestro & { User?: User }) || null;
}

export async function getAulasByMaestro(maestroId: number): Promise<Aula[]> {
  return mockAulas;
}

export async function searchMaestros(searchTerm: string): Promise<(Maestro & { User?: User })[]> {
  const term = searchTerm.toLowerCase();
  return mockMaestros.filter(m => 
    m.IsActive && (
      m.Email?.toLowerCase().includes(term) ||
      m.FullName?.toLowerCase().includes(term)
    )
  ) as (Maestro & { User?: User })[];
}

export async function createMaestro(request: CreateMaestroRequest): Promise<Maestro & { User?: User }> {
  const maestro: Maestro & { User?: User } = {
    MaestroId: Math.max(...mockMaestros.map(m => m.MaestroId || 0)) + 1,
    UserId: request.UserId,
    Phone: request.Phone,
    Specialty: request.Specialty,
    IsActive: true,
    CreatedAt: new Date(),
  } as any;
  mockMaestros.push(maestro as any);
  return maestro;
}

export async function updateMaestro(maestroId: number, request: UpdateMaestroRequest): Promise<Maestro & { User?: User }> {
  const maestro = mockMaestros.find(m => m.MaestroId === maestroId) as any;
  if (!maestro) throw new Error('Maestro no encontrado');
  
  if (request.Phone !== undefined) maestro.Phone = request.Phone;
  if (request.Specialty !== undefined) maestro.Specialty = request.Specialty;
  return maestro;
}

export async function deleteMaestro(maestroId: number): Promise<void> {
  const maestro = mockMaestros.find(m => m.MaestroId === maestroId) as any;
  if (maestro) maestro.IsActive = false;
}

// ========== SERVICIOS PARA RELACIONES MAESTRO-AULA ==========

export async function assignMaestroToAula(
  maestroId: number,
  aulaId: number,
  startDate: Date,
  endDate?: Date
): Promise<MaestroAula> {
  return { MaestroAulaId: 1, MaestroId: maestroId, AulaId: aulaId, StartDate: startDate, EndDate: endDate, IsActive: true } as MaestroAula;
}

export async function removeMaestroFromAula(maestroId: number, aulaId: number): Promise<void> {
  // Mock: do nothing
}

export async function getCurrentMaestroOfAula(aulaId: number): Promise<(Maestro & { User?: User }) | null> {
  return mockMaestros.length > 0 ? (mockMaestros[0] as any) : null;
}
