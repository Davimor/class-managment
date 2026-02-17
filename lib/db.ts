import sql from 'mssql';

// Configuración de conexión a MSSQL
const config = {
  server: process.env.MSSQL_SERVER || 'localhost',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  database: process.env.MSSQL_DATABASE || 'catequesis',
  authentication: {
    type: process.env.MSSQL_AUTH_TYPE === 'windows' ? 'default' : 'basic',
    options: {
      userName: process.env.MSSQL_USER || 'sa',
      password: process.env.MSSQL_PASSWORD || '',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableKeepAlive: true,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
  },
};

// Pool de conexiones
let connectionPool: sql.ConnectionPool | null = null;
let connectionError: Error | null = null;
let isConnecting = false;

/**
 * Obtiene o crea el pool de conexiones a MSSQL
 * Si las credenciales no están configuradas, retorna un error
 */
export async function getConnectionPool(): Promise<sql.ConnectionPool> {
  // Validar que tengamos credenciales mínimas
  if (!process.env.MSSQL_SERVER || !process.env.MSSQL_USER) {
    throw new Error(
      'Credenciales MSSQL no configuradas. Por favor configura MSSQL_SERVER, MSSQL_USER, MSSQL_PASSWORD en tu archivo .env.local'
    );
  }

  try {
    if (connectionPool && connectionPool.connected) {
      return connectionPool;
    }

    if (isConnecting) {
      // Evitar múltiples conexiones simultáneas
      await new Promise(resolve => setTimeout(resolve, 100));
      if (connectionPool && connectionPool.connected) {
        return connectionPool;
      }
    }

    isConnecting = true;
    connectionPool = new sql.ConnectionPool(config);

    await connectionPool.connect();
    console.log('[MSSQL] Conexión exitosa a la base de datos');
    connectionError = null;
    isConnecting = false;

    connectionPool.on('error', (err) => {
      console.error('[MSSQL] Error en pool:', err);
      connectionPool = null;
      connectionError = err;
    });

    return connectionPool;
  } catch (error) {
    isConnecting = false;
    connectionError = error as Error;
    console.error('[MSSQL] Error al conectar:', error);
    throw error;
  }
}

/**
 * Cierra la conexión del pool
 */
export async function closeConnectionPool(): Promise<void> {
  if (connectionPool && connectionPool.connected) {
    await connectionPool.close();
    connectionPool = null;
    console.log('[MSSQL] Pool de conexiones cerrado');
  }
}

/**
 * Ejecuta una consulta de lectura
 */
export async function query<T>(queryString: string, params?: Record<string, any>): Promise<T[]> {
  try {
    const pool = await getConnectionPool();
    const request = pool.request();

    // Agregar parámetros a la consulta
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(queryString);
    return result.recordset as T[];
  } catch (error) {
    console.error('[MSSQL] Error en query:', error, queryString);
    throw error;
  }
}

/**
 * Ejecuta una consulta que retorna un único registro
 */
export async function queryOne<T>(queryString: string, params?: Record<string, any>): Promise<T | null> {
  const results = await query<T>(queryString, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Ejecuta un procedimiento almacenado
 */
export async function executeStoredProcedure<T>(
  procedureName: string,
  params?: Record<string, any>
): Promise<T[]> {
  try {
    const pool = await getConnectionPool();
    const request = pool.request();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.execute(procedureName);
    return result.recordset as T[];
  } catch (error) {
    console.error('[MSSQL] Error en procedimiento:', error, procedureName);
    throw error;
  }
}

/**
 * Inicia una transacción
 */
export async function beginTransaction(): Promise<sql.ConnectionPool> {
  const pool = await getConnectionPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  return pool;
}

export default {
  getConnectionPool,
  closeConnectionPool,
  query,
  queryOne,
  executeStoredProcedure,
  beginTransaction,
};
