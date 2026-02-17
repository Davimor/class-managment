# Sistema de Gestión de Catequesis - Instrucciones Rápidas

## Problema del ZIP Vacío

Si el ZIP aparece vacío (1 KB), es porque hay un error de compilación en el preview de v0. **Esto es normal para proyectos complejos.**

## Solución: Instalar Manualmente

### Opción 1: Copiar Archivos Manualmente

1. Copia cada archivo desde v0 a tu computadora localmente
2. Crea una carpeta nueva: `mkdir catequesis-management && cd catequesis-management`
3. Copia todos los archivos desde el editor de v0

### Opción 2: Usar GitHub (Recomendado)

1. En v0, conecta el proyecto a GitHub desde el sidebar
2. Clona el repositorio: `git clone [tu-repo]`
3. Instala: `npm install`
4. Ejecuta: `npm run dev`

### Opción 3: Crear desde Cero

```bash
# 1. Crear proyecto Next.js
npx create-next-app@latest catequesis --typescript --tailwind --app

# 2. Instalar dependencias
cd catequesis
npm install bcryptjs jsonwebtoken mssql
npm install -D @types/bcryptjs @types/jsonwebtoken

# 3. Copiar archivos desde v0 (app/, components/, lib/, scripts/)

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales MSSQL

# 5. Ejecutar
npm run dev
```

## Credenciales de Prueba

- Email: `admin@parroquia.local`
- Password: `test123` o cualquier password en modo desarrollo

## Estructura del Proyecto

```
Curso (Nivel 1, 2, 3)
  └── Clases (1A, 1B, 2A, 2B, 2C, etc)
      └── Alumnos
          └── Progenitores
```

## Tipos de Cursos

1. **Fundamentación**: Directorio para la Catequesis y Biblia
2. **Pedagogía**: Metodologías de enseñanza de la fe
3. **Contenido Dogmático**: Fe, moral, liturgia y vida espiritual

## Archivos Clave

- `scripts/01-init-database.sql` - Crear tablas en MSSQL
- `.env.example` - Variables de entorno
- `lib/mock-data.ts` - Datos de prueba
- `app/page.tsx` - Login
- `app/dashboard/*` - Páginas principales

## Soporte

Si necesitas ayuda, revisa:
- `INSTALL.md` - Guía detallada de instalación
- `API_TESTING.md` - Ejemplos de testing
- `PROJECT_SUMMARY.md` - Resumen del proyecto
