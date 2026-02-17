Catequesis Management System - Instalación y Uso Rápido
=======================================================

## Requisitos
- Node.js 18+ 
- npm o pnpm
- (Opcional) SQL Server para base de datos

## Instalación Rápida (3 pasos)

### 1. Instalar dependencias
```bash
npm install
# o si usas pnpm
pnpm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz:
```env
# Para desarrollo, estas son opcionales (usa mock data)
MSSQL_SERVER=localhost
MSSQL_PORT=1433
MSSQL_USER=sa
MSSQL_PASSWORD=tuContraseña
MSSQL_DATABASE=catequesis
MSSQL_AUTH_TYPE=basic
```

### 3. Ejecutar
```bash
npm run dev
```

Accede a: http://localhost:3000

## Credenciales de Prueba

Modo Desarrollo (sin MSSQL):
- Email: admin@parroquia.local
- Contraseña: test123

## Características

✓ Gestión de Alumnos
✓ Gestión de Maestros
✓ Gestión de Aulas
✓ Gestión de Progenitores
✓ Generación de Reportes (CSV, JSON, HTML)
✓ Autenticación con JWT
✓ Control de Roles
✓ Interfaz Responsiva

## Estructura del Proyecto

```
app/
├── api/              # API Routes protegidas
├── dashboard/        # Páginas del dashboard
└── page.tsx          # Página de login

lib/
├── db.ts             # Conexión a MSSQL
├── types.ts          # Tipos TypeScript
├── services/         # Lógica de negocio
└── mock-data.ts      # Datos para desarrollo

components/
├── dashboard-layout.tsx
├── login-form.tsx
└── [feature]/        # Componentes por módulo

scripts/
└── 01-init-database.sql  # Script SQL para MSSQL
```

## Con MSSQL (Producción)

1. Ejecuta el script SQL:
```bash
# En SQL Server Management Studio o sqlcmd
sqlcmd -S localhost -U sa -P tuContraseña -i scripts/01-init-database.sql
```

2. Configura variables de entorno con tus credenciales reales

3. Reinicia el servidor dev

## Troubleshooting

**Puerto 3000 ya en uso:**
```bash
npm run dev -- -p 3001
```

**Problemas de conexión MSSQL:**
- Verifica credenciales en `.env.local`
- Asegúrate que SQL Server esté corriendo
- En desarrollo, funciona sin MSSQL con datos mock

**Necesitas más ayuda:**
- Revisa `SIMPLE_START.md` para guía paso a paso
- Revisa `API_TESTING.md` para ejemplos de API
- Revisa `README.md` para documentación completa
