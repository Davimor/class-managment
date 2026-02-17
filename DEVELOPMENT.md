# Guía de Desarrollo - Sistema de Gestión de Catequesis

## Iniciar Rápidamente (Desarrollo Local)

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Ejecutar el servidor de desarrollo
```bash
npm run dev
```

### Paso 3: Acceder a la aplicación
- Abre tu navegador en: `http://localhost:3000`

## Credenciales de Prueba (Modo Desarrollo)

El sistema está configurado con **mock data** para que funcione sin necesidad de MSSQL inicialmente.

**Usuarios disponibles:**
- Email: `admin@parroquia.local` | Contraseña: `test123`
- Email: `maestro@parroquia.local` | Contraseña: `test123`
- Email: `secretaria@parroquia.local` | Contraseña: `test123`

## Migración a Base de Datos MSSQL

Una vez que tengas MSSQL configurado, sigue estos pasos:

### 1. Configurar Credenciales
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración MSSQL
MSSQL_SERVER=your_server_address
MSSQL_PORT=1433
MSSQL_DATABASE=catequesis
MSSQL_USER=sa
MSSQL_PASSWORD=your_password
MSSQL_AUTH_TYPE=sql  # o 'windows' si usas Windows Authentication

# Configuración JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
```

### 2. Ejecutar Script SQL
1. Abre SQL Server Management Studio (SSMS) o tu cliente MSSQL
2. Ejecuta el script: `/scripts/01-init-database.sql`
3. Crea un usuario admin en la tabla `Usuarios` con contraseña hasheada

### 3. Actualizar Servicios
Los archivos en `/lib/services/` están listos para conectar a MSSQL. Solo necesitas:
- Comentar las líneas que usan `mockData`
- Descomentar las llamadas a `getConnectionPool()` y `query()`

### 4. Reiniciar Servidor
```bash
npm run dev
```

## Estructura de Carpetas

```
/vercel/share/v0-project/
├── app/
│   ├── api/              # Rutas API
│   ├── dashboard/        # Páginas protegidas del dashboard
│   ├── layout.tsx        # Layout raíz
│   └── page.tsx          # Página de login
├── components/           # Componentes React reutilizables
├── hooks/                # Custom hooks
├── lib/
│   ├── db.ts            # Configuración MSSQL
│   ├── mock-data.ts     # Datos de prueba
│   ├── services/        # Lógica de negocio
│   └── types.ts         # Tipos TypeScript
├── scripts/
│   └── 01-init-database.sql  # Script para crear tablas
├── middleware.ts         # Middleware de autenticación
└── package.json         # Dependencias
```

## Características Implementadas

### Autenticación
- Login con JWT
- Roles: Admin, Maestro, Secretaría
- Middleware de protección de rutas

### Módulos
- **Alumnos**: Crear, editar, eliminar, buscar
- **Maestros**: Gestión de docentes
- **Aulas**: Administración de clases
- **Progenitores**: Información de padres/tutores
- **Reportes**: Exportar a PDF y Excel
- **Usuarios**: Crear cuentas de usuario (solo admin)

## Depuración

### Ver logs en consola
Abre la consola del navegador (F12) para ver errores del cliente y red.

### Ver logs del servidor
El terminal donde ejecutas `npm run dev` mostrará los logs del servidor.

## Desplegar en Producción

### 1. Configurar variables de entorno
Asegúrate de que `.env.local` tiene:
```env
JWT_SECRET=your-very-secure-random-string
MSSQL_PASSWORD=your-strong-password
```

### 2. Compilar para producción
```bash
npm run build
npm start
```

### 3. Usar una BD MSSQL real
- Azure SQL Database (recomendado)
- AWS RDS SQL Server
- SQL Server en tu infraestructura

## Troubleshooting

### Error: "Credenciales MSSQL no configuradas"
- Verifica que `.env.local` existe
- Revisa que las variables `MSSQL_SERVER` y `MSSQL_USER` están configuradas

### Error: "Token inválido"
- Limpia el localStorage del navegador
- Vuelve a iniciar sesión

### Error: "Conexión a BD rechazada"
- Verifica que el servidor MSSQL está funcionando
- Comprueba las credenciales en `.env.local`
- Asegúrate que el firewall permite conexiones en puerto 1433

## Contrato API

Ver `/API_TESTING.md` para ejemplos de llamadas cURL a todos los endpoints.
