# Instalación y Primeros Pasos

## 1. Instalación de Dependencias

```bash
npm install
# o
pnpm install
```

## 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y completa tus credenciales MSSQL:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales:
- `MSSQL_SERVER`: Tu servidor MSSQL
- `MSSQL_PORT`: Puerto (generalmente 1433)
- `MSSQL_USER`: Tu usuario
- `MSSQL_PASSWORD`: Tu contraseña
- `MSSQL_DATABASE`: Nombre de tu base de datos
- `JWT_SECRET`: Cambia a una clave segura
- `NEXTAUTH_SECRET`: Cambia a una clave segura

## 3. Inicializar Base de Datos

Abre tu cliente MSSQL (SQL Server Management Studio, Azure Data Studio, etc.) y ejecuta:

```sql
-- Abre el archivo: scripts/01-init-database.sql
-- Y ejecuta todo el contenido
```

## 4. Ejecutar Servidor de Desarrollo

```bash
npm run dev
# o
pnpm dev
```

Accede a `http://localhost:3000`

## 5. Primer Acceso

- Email: `admin@parroquia.local`
- Contraseña: Debes cambiarla manualmente en la BD ejecutando un script SQL con bcrypt hash

## Estructura del Proyecto

```
- /app
  - /api - API Routes (login, crud, etc)
  - /dashboard - Páginas protegidas
    - /alumnos - Gestión de alumnos
    - /maestros - Gestión de maestros
    - /aulas - Gestión de aulas
    - /progenitores - Gestión de progenitores
  - /page.tsx - Login
  
- /components
  - /ui - Componentes shadcn/ui
  - /alumnos - Componentes específicos
  - dashboard-layout.tsx - Layout principal
  - login-form.tsx - Formulario login
  - protected-route.tsx - Protección de rutas
  
- /lib
  - db.ts - Conexión MSSQL
  - api-client.ts - Cliente HTTP con auth
  - types.ts - Tipos TypeScript
  - /services - Lógica de negocios
    - auth.service.ts
    - alumnos.service.ts
    - aulas.service.ts
    - reports.service.ts
    
- /scripts
  - 01-init-database.sql - Schema SQL
  
- /hooks
  - use-auth.ts - Hook de autenticación
  
- middleware.ts - Middleware de auth
- SETUP.md - Guía detallada de configuración
```

## ¿Qué se ha implementado?

✅ **Completado:**
- Conexión MSSQL con pool de conexiones
- Modelo de datos (Alumnos, Maestros, Aulas, Progenitores)
- Sistema JWT de autenticación
- Middleware de protección de rutas
- Dashboard con navegación
- CRUD de Alumnos (UI + API)
- Servicios de lógica de negocio
- API protegidas con roles

🔄 **Por completar:**
- [ ] CRUD de Maestros UI
- [ ] CRUD de Aulas UI
- [ ] CRUD de Progenitores UI
- [ ] Sistema de asignaciones (Maestro-Aula, Alumno-Aula, Alumno-Progenitor)
- [ ] Sistema de reportes (PDF y Excel)
- [ ] Sistema de asistencia y calificaciones
- [ ] Validaciones avanzadas y mejoras de UX

## Troubleshooting

**"Connection refused"**
- Verifica que MSSQL está ejecutándose
- Comprueba las credenciales en .env.local
- Verifica el puerto 1433 en firewall

**"Cannot find module 'mssql'"**
```bash
npm install
```

**"Token inválido"**
- Limpia localStorage en el navegador
- Vuelve a iniciar sesión

## Próximos Pasos

1. Personaliza el branding (colores, logo)
2. Implementa las páginas de maestros, aulas y progenitores
3. Agrega sistema de asignaciones
4. Implementa reportes PDF y Excel
5. Añade validaciones y tests
6. Configura para producción

## API Endpoints Implementados

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/users
POST   /api/users
PUT    /api/users/[id]
DELETE /api/users/[id]

GET    /api/alumnos
POST   /api/alumnos
PUT    /api/alumnos/[id]
DELETE /api/alumnos/[id]
GET    /api/alumnos/[id]/progenitores

GET    /api/aulas
POST   /api/aulas
PUT    /api/aulas/[id]
DELETE /api/aulas/[id]

GET    /api/maestros
POST   /api/maestros
PUT    /api/maestros/[id]
DELETE /api/maestros/[id]

GET    /api/progenitores
POST   /api/progenitores
PUT    /api/progenitores/[id]
DELETE /api/progenitores/[id]
```

## Seguridad en Desarrollo

⚠️ Cambiar estas cosas antes de producción:
- [ ] JWT_SECRET y NEXTAUTH_SECRET
- [ ] Contraseña del usuario admin
- [ ] Configurar HTTPS
- [ ] Implementar rate limiting
- [ ] Configurar CORS
- [ ] Validar todas las entradas
- [ ] Configurar RLS en BD
- [ ] Backups automáticos
