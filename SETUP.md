# 🎓 Sistema de Gestión de Catequesis - Guía de Configuración Inicial

## Requisitos Previos

1. **SQL Server MSSQL** accesible con credenciales de conexión
2. **Node.js 18+** instalado
3. **npm** o **pnpm** como gestor de paquetes

## Pasos de Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto basado en `.env.example`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales MSSQL reales:

```env
# Variables de MSSQL
MSSQL_SERVER=tu-servidor.com      # o localhost para desarrollo local
MSSQL_PORT=1433
MSSQL_USER=tu_usuario
MSSQL_PASSWORD=tu_contraseña_segura
MSSQL_DATABASE=catequesis
MSSQL_AUTH_TYPE=sql               # 'sql' o 'windows'

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_de_almenos_32_caracteres
JWT_EXPIRATION=7d

# NextAuth
NEXTAUTH_SECRET=otro_secreto_super_seguro_de_almenos_32_caracteres

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Inicializar la Base de Datos

**Opción A: Ejecutar el script SQL directamente**

Abre SQL Server Management Studio (SSMS) o tu cliente MSSQL favorito:

```bash
1. Conecta a tu servidor MSSQL con las credenciales
2. Abre el archivo: scripts/01-init-database.sql
3. Ejecuta todo el script
```

**Opción B: Usando Azure Data Studio**

```bash
1. Conecta a tu servidor MSSQL
2. File → Open → scripts/01-init-database.sql
3. Run Script (F5)
```

### 3. Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### 4. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
# o
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

## Primeros Pasos en la Aplicación

### Acceso Inicial

1. Navega a `http://localhost:3000`
2. Inicia sesión con:
   - **Email**: `admin@parroquia.local`
   - **Contraseña**: Debes cambiar esto en la BD manualmente (o usar script de seed)

> ⚠️ **IMPORTANTE**: Por favor, cambiar la contraseña del usuario admin inmediatamente después del primer acceso.

### Cambiar Contraseña del Admin (SQL)

```sql
-- Script para actualizar la contraseña del admin
-- NOTA: Debes hashear la contraseña con bcryptjs primero

-- Opción: Usar una herramienta para generar el hash bcrypt
-- Ejemplo en Node.js:
-- const bcryptjs = require('bcryptjs');
-- bcryptjs.hash('tu_nueva_contraseña', 10).then(hash => console.log(hash));

UPDATE Users 
SET PasswordHash = 'PUT_HASHED_PASSWORD_HERE'
WHERE Email = 'admin@parroquia.local';
```

## Estructura de Carpetas

```
/vercel/share/v0-project
├── app/
│   ├── api/              # API Routes (autenticación, CRUD)
│   ├── dashboard/        # Dashboard protegido
│   ├── layout.tsx        # Layout raíz
│   ├── page.tsx          # Página de login
│   └── globals.css       # Estilos globales
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   └── *.tsx            # Componentes personalizados
├── lib/
│   ├── db.ts            # Conexión a MSSQL
│   ├── types.ts         # Tipos TypeScript
│   └── services/        # Servicios de lógica de negocio
│       ├── auth.service.ts
│       ├── alumnos.service.ts
│       ├── aulas.service.ts
│       └── reports.service.ts
├── scripts/
│   └── 01-init-database.sql  # Script SQL inicial
├── .env.example         # Variables de entorno (ejemplo)
└── .env.local          # Variables de entorno (local, gitignored)
```

## Funcionalidades Principales

### ✅ Implementado (Tarea 1)
- [x] Conexión MSSQL con pool de conexiones
- [x] Modelo de datos completo (Alumnos, Maestros, Aulas, Progenitores)
- [x] Sistema de autenticación con JWT
- [x] Servicios de CRUD para todas las entidades
- [x] Página de login
- [x] Página inicial con estructura base

### 🔄 Por Implementar
- [ ] Dashboard con estadísticas
- [ ] Módulo de gestión de alumnos (CRUD UI)
- [ ] Módulo de gestión de maestros
- [ ] Módulo de gestión de aulas
- [ ] Módulo de gestión de progenitores
- [ ] Sistema de reportes (PDF y Excel)
- [ ] Validaciones avanzadas y seguridad

## Troubleshooting

### Error: "Cannot find module 'mssql'"
```bash
npm install mssql
```

### Error: "Connection refused"
- Verificar que SQL Server está ejecutándose
- Verificar credenciales en `.env.local`
- Verificar firewall (puerto 1433)

### Error: "Timeout connecting to database"
- Aumentar `connectionTimeout` en `lib/db.ts`
- Verificar conectividad de red
- Si es Azure SQL, verificar reglas de firewall

### La contraseña del admin no funciona
- Verificar que el hash de contraseña es correcto
- Re-ejecutar el script SQL inicial para resetear

## Seguridad en Producción

⚠️ **IMPORTANTE - NO SUBIR A PRODUCCIÓN SIN:**

1. ✅ Cambiar JWT_SECRET y NEXTAUTH_SECRET
2. ✅ Cambiar contraseña del usuario admin
3. ✅ Configurar HTTPS
4. ✅ Implementar rate limiting en APIs
5. ✅ Configurar CORS correctamente
6. ✅ Validar todas las entradas del usuario
7. ✅ Usar variables de entorno seguras en hosting
8. ✅ Implementar Row-Level Security (RLS) en BD
9. ✅ Hacer backup regular de la BD

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Inicia sesión

### Alumnos
- `GET /api/alumnos` - Obtiene todos los alumnos
- `GET /api/alumnos/[id]` - Obtiene un alumno
- `POST /api/alumnos` - Crea un alumno
- `PUT /api/alumnos/[id]` - Actualiza un alumno
- `DELETE /api/alumnos/[id]` - Elimina un alumno

## Próximas Tareas

1. **Tarea 2**: Autenticación avanzada y middleware de protección
2. **Tarea 3**: Dashboard con estadísticas
3. **Tarea 4**: CRUD UI para Alumnos
4. **Tarea 5**: CRUD UI para Maestros y Aulas
5. **Tarea 6**: CRUD UI para Progenitores
6. **Tarea 7**: Sistema de reportes interactivo
7. **Tarea 8**: Validaciones y refinamientos finales

## Contacto y Soporte

Para problemas específicos de MSSQL, consulta:
- [SQL Server Documentation](https://learn.microsoft.com/en-us/sql/)
- [mssql npm package](https://www.npmjs.com/package/mssql)

Para Next.js:
- [Next.js Documentation](https://nextjs.org/docs)
