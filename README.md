# Sistema de Gestión de Catequesis

Aplicación web profesional para gestionar alumnos, maestros, aulas y progenitores en una parroquia.

## Características Principales

### Gestión de Datos
- **Alumnos**: Crear, editar, ver y eliminar alumnos con información completa
- **Maestros**: Gestionar maestros y sus asignaciones a aulas
- **Aulas**: Administrar aulas y su capacidad
- **Progenitores**: Gestionar información de padres/tutores con datos de contacto y emergencia
- **Usuarios del Sistema**: Crear y gestionar usuarios con diferentes roles

### Seguridad
- Autenticación con JWT (JSON Web Tokens)
- Contraseñas hashadas con bcryptjs
- Control de roles y permisos:
  - **Admin**: Acceso total a todas las funciones
  - **Maestro**: Acceso a alumnos y aulas asignadas
  - **Secretaría**: Acceso a gestión completa (excepto usuarios)
- Middleware de autenticación en todas las rutas protegidas

### Reportes
- Exportación a PDF
- Exportación a Excel
- Reportes de:
  - Listado de alumnos
  - Listado de maestros
  - Listado de aulas
  - Listado de progenitores
  - Reporte de asistencia

### Dashboard
- Estadísticas en tiempo real
- Vista rápida de totales
- Navegación intuitiva por roles

## Tecnologías Utilizadas

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Base de Datos**: Microsoft SQL Server (MSSQL)
- **Autenticación**: JWT + bcryptjs
- **Reportes**: PDFKit, ExcelJS
- **Estado**: React Hooks + SWR (recomendado)

## Requisitos Previos

- Node.js 18+
- pnpm (package manager recomendado)
- Microsoft SQL Server 2019+ o Azure SQL Database
- Credenciales de acceso a MSSQL

## Instalación

### 1. Clonar el proyecto

```bash
git clone <tu-repo>
cd catequesis-app
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de MSSQL:

```env
# MSSQL Configuration
MSSQL_SERVER=tu-servidor.com
MSSQL_PORT=1433
MSSQL_DATABASE=catequesis
MSSQL_USER=tu-usuario
MSSQL_PASSWORD=tu-contraseña
MSSQL_AUTH_TYPE=sql

# JWT Configuration
JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRATION=7d
```

### 4. Configurar la base de datos

Ejecuta el script SQL para crear las tablas:

```bash
# Desde SQL Server Management Studio o Azure Data Studio
# Abre scripts/01-init-database.sql y ejecuta todas las consultas
```

O crea un user admin inicial en la BD (opcional):

```sql
INSERT INTO users (email, password_hash, role, created_at, updated_at)
VALUES ('admin@parroquia.local', '<hash-bcrypt>', 'admin', GETDATE(), GETDATE());
```

### 5. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Accede a `http://localhost:3000` en tu navegador.

## Estructura del Proyecto

```
.
├── app/
│   ├── api/              # API Routes protegidas
│   │   ├── auth/         # Autenticación
│   │   ├── alumnos/      # Gestión de alumnos
│   │   ├── maestros/     # Gestión de maestros
│   │   ├── aulas/        # Gestión de aulas
│   │   ├── progenitores/ # Gestión de progenitores
│   │   ├── users/        # Gestión de usuarios
│   │   └── reports/      # Generación de reportes
│   ├── dashboard/        # Páginas del dashboard
│   │   ├── alumnos/
│   │   ├── maestros/
│   │   ├── aulas/
│   │   ├── progenitores/
│   │   ├── usuarios/
│   │   └── reports/
│   ├── page.tsx          # Página de login
│   └── layout.tsx        # Layout principal
├── components/           # Componentes React
│   ├── alumnos/         # Componentes de alumnos
│   ├── maestros/        # Componentes de maestros
│   ├── aulas/           # Componentes de aulas
│   ├── progenitores/    # Componentes de progenitores
│   ├── reports/         # Componentes de reportes
│   └── ui/              # Componentes UI (shadcn)
├── lib/
│   ├── db.ts            # Configuración de MSSQL
│   ├── types.ts         # Tipos TypeScript
│   ├── api-client.ts    # Cliente HTTP con JWT
│   ├── services/        # Servicios de lógica de negocios
│   └── report-generator.ts # Utilidades de reportes
├── hooks/               # React Hooks personalizados
│   └── use-auth.ts      # Hook para autenticación
├── middleware.ts        # Middleware de autenticación
├── scripts/
│   └── 01-init-database.sql # Script de inicialización BD
└── public/              # Archivos estáticos
```

## Uso

### Login

1. Accede a `http://localhost:3000`
2. Ingresa tus credenciales (email y contraseña)
3. El sistema validará contra la base de datos

### Gestión de Alumnos

- **Ver todos**: Ir a Dashboard > Alumnos
- **Crear**: Click en "Nuevo Alumno"
- **Editar**: Click en el ícono de edición en la fila
- **Ver detalles**: Click en el nombre del alumno
- **Eliminar**: Click en el ícono de papelera

### Gestión de Maestros

- Similar a alumnos, pero en Dashboard > Maestros
- Solo usuarios con rol admin o secretaría

### Gestión de Aulas

- Crear aulas y asignar maestros
- Ver alumnos asignados a cada aula

### Gestión de Progenitores

- Información de contacto completa
- Relación con alumnos
- Datos de emergencia

### Generar Reportes

1. Ir a Dashboard > Reportes
2. Seleccionar tipo de reporte (Alumnos, Maestros, etc.)
3. Elegir formato (PDF o Excel)
4. Click en "Descargar Reporte"

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Alumnos
- `GET /api/alumnos` - Listar alumnos
- `POST /api/alumnos` - Crear alumno
- `PUT /api/alumnos/:id` - Actualizar alumno
- `DELETE /api/alumnos/:id` - Eliminar alumno
- `GET /api/alumnos/:id/progenitores` - Obtener progenitores

### Maestros
- `GET /api/maestros` - Listar maestros
- `POST /api/maestros` - Crear maestro
- `PUT /api/maestros/:id` - Actualizar maestro
- `DELETE /api/maestros/:id` - Eliminar maestro

### Aulas
- `GET /api/aulas` - Listar aulas
- `POST /api/aulas` - Crear aula
- `PUT /api/aulas/:id` - Actualizar aula
- `DELETE /api/aulas/:id` - Eliminar aula

### Progenitores
- `GET /api/progenitores` - Listar progenitores
- `POST /api/progenitores` - Crear progenitor
- `PUT /api/progenitores/:id` - Actualizar progenitor
- `DELETE /api/progenitores/:id` - Eliminar progenitor

### Usuarios (solo admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Reportes
- `POST /api/reports/generate` - Generar reporte (PDF/Excel)

## Roles y Permisos

| Función | Admin | Maestro | Secretaría |
|---------|-------|---------|-----------|
| Ver Alumnos | ✅ | ✅ | ✅ |
| Crear/Editar Alumnos | ✅ | ❌ | ✅ |
| Eliminar Alumnos | ✅ | ❌ | ✅ |
| Ver Maestros | ✅ | ✅ | ✅ |
| Gestionar Maestros | ✅ | ❌ | ✅ |
| Ver Aulas | ✅ | ✅ | ✅ |
| Gestionar Aulas | ✅ | ❌ | ✅ |
| Ver Progenitores | ✅ | ❌ | ✅ |
| Gestionar Progenitores | ✅ | ❌ | ✅ |
| Reportes | ✅ | ❌ | ✅ |
| Gestionar Usuarios | ✅ | ❌ | ❌ |

## Solución de Problemas

### Error: "Credenciales MSSQL no configuradas"
- Verifica que `.env.local` existe y contiene todas las variables necesarias
- Comprueba que los valores de credenciales son correctos
- Reinicia el servidor después de cambiar variables de entorno

### Error: "Token inválido o expirado"
- El token JWT expiró, inicia sesión nuevamente
- Verifica que `JWT_SECRET` es consistente en el servidor

### Error: "Acceso denegado"
- Verifica que tu usuario tiene el rol correcto en la base de datos
- Comprueba los permisos asignados a tu rol

### Base de datos no se conecta
- Verifica que el servidor MSSQL está ejecutándose
- Prueba la conexión desde SQL Server Management Studio
- Comprueba el firewall permitir la conexión al puerto 1433

## Desarrollo

### Agregar nuevas páginas

1. Crea una carpeta en `app/dashboard/nueva-seccion/`
2. Dentro, crea un archivo `page.tsx`
3. Importa el `DashboardLayout`
4. Agrega el item al menú en `components/dashboard-layout.tsx`

### Agregar nuevos servicios

1. Crea un archivo en `lib/services/nuevo-servicio.ts`
2. Importa el módulo `db.ts`
3. Escribe las funciones de CRUD
4. Exporta las funciones

### Agregar nuevas rutas API

1. Crea una carpeta en `app/api/nueva-ruta/`
2. Crea un archivo `route.ts` con manejadores GET, POST, PUT, DELETE
3. Usa `verifyToken()` para proteger la ruta
4. Retorna respuestas JSON

## Deployment

### Vercel (Recomendado)

1. Sube el código a GitHub
2. En Vercel, crea un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Configura las variables de entorno
5. Deploy

### Self-Hosted

1. Instala Node.js en el servidor
2. Clona el repositorio
3. Configura `.env.local`
4. Ejecuta `pnpm build`
5. Ejecuta `pnpm start`

## Seguridad

- Nunca commitees archivo `.env.local` con credenciales reales
- Usa contraseñas fuertes para la base de datos
- Cambia `JWT_SECRET` con una clave segura y aleatoria
- Implementa HTTPS en producción
- Regularmente haz backup de tu base de datos

## Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

Este proyecto está bajo licencia MIT.

## Soporte

Para soporte, contacta al equipo de desarrollo o abre un issue en el repositorio.

---

**Versión**: 1.0.0
**Última actualización**: 2024
