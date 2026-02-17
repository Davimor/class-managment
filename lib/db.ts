/**
 * Database module - uses dynamic import for mssql to avoid
 * Turbopack bundling node:stream at build time.
 */

// Configuración de conexión a MSSQL
const config = {
  server: process.env.MSSQL_SERVER || 'localhost',
  port: parseInt(process.env.MSSQL_PORT || '1433'),
  database: process.env.MSSQL_DATABASE || 'catequesis',
  authentication: {
    type: (process.env.MSSQL_AUTH_TYPE === 'windows' ? 'default' : 'basic') as any,
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

// Pool de conexiones (lazy loaded)
let connectionPool: any = null;
let isConnecting = false;

/**
 * Dynamically imports mssql to avoid Turbopack resolving node:stream at build time
 */
async function getMssql() {
  const sql = await import('mssql');
  return sql.default || sql;
}

/**
 * Obtiene o crea el pool de conexiones a MSSQL
 */
export async function getConnectionPool() {
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
      await new Promise(resolve => setTimeout(resolve, 100));
      if (connectionPool && connectionPool.connected) {
        return connectionPool;
      }
    }

    isConnecting = true;
    const sql = await getMssql();
    connectionPool = new sql.ConnectionPool(config);

    await connectionPool.connect();
    console.log('[MSSQL] Conexion exitosa a la base de datos');
    isConnecting = false;

    connectionPool.on('error', (err: any) => {
      console.error('[MSSQL] Error en pool:', err);
      connectionPool = null;
    });

    return connectionPool;
  } catch (error) {
    isConnecting = false;
    console.error('[MSSQL] Error al conectar:', error);
    throw error;
  }
}

/**
 * Cierra la conexion del pool
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
 * Ejecuta una consulta que retorna un unico registro
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
 * Inicia una transaccion
 */
export async function beginTransaction() {
  const pool = await getConnectionPool();
  const sql = await getMssql();
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
