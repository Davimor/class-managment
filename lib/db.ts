/**
 * Database module - stubbed for mock data environment
 * 
 * In production, this would connect to MSSQL.
 * For development/testing, all data comes from mock-data.ts
 */

export async function query(sql: string, params?: any[]): Promise<any> {
  console.log('[v0] Query called but using mock data:', sql);
  return { recordset: [] };
}

export async function queryOne(sql: string, params?: any[]): Promise<any> {
  console.log('[v0] QueryOne called but using mock data:', sql);
  return null;
}

export async function connect(): Promise<any> {
  console.log('[v0] DB connect called - mock environment');
  return { connected: true };
}

export async function disconnect(): Promise<void> {
  console.log('[v0] DB disconnect called - mock environment');
}

export async function executeStoredProcedure(name: string, params?: any): Promise<any[]> {
  console.log('[v0] Stored procedure called but using mock data:', name);
  return [];
}

export async function beginTransaction(): Promise<any> {
  console.log('[v0] Transaction begin called - mock environment');
  return { begin: true };
}

export default {
  query,
  queryOne,
  connect,
  disconnect,
  executeStoredProcedure,
  beginTransaction,
};
