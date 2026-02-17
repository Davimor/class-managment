# Inicio Rápido (2 minutos)

## Paso 1: Instalar
```bash
npm install
```

## Paso 2: Ejecutar
```bash
npm run dev
```

## Paso 3: Acceder
- URL: `http://localhost:3000`
- Email: `admin@parroquia.local`
- Contraseña: `test123`

## ¿Eso es todo?
¡Sí! El sistema está configurado con datos de prueba para que funcione inmediatamente sin necesidad de MSSQL.

---

## Para usar tu propia Base de Datos MSSQL

1. Abre `.env.local` (cópialo de `.env.example` si no existe)
2. Rellena tus credenciales MSSQL:
   ```
   MSSQL_SERVER=tu_servidor
   MSSQL_USER=tu_usuario
   MSSQL_PASSWORD=tu_contraseña
   ```
3. Ejecuta el script SQL en `/scripts/01-init-database.sql`
4. Reinicia con `npm run dev`

---

## Características Disponibles

- ✅ Gestión de Alumnos (crear, editar, eliminar)
- ✅ Gestión de Maestros y Aulas
- ✅ Información de Progenitores
- ✅ Reportes en PDF y Excel
- ✅ Autenticación con roles
- ✅ Dashboard con estadísticas

---

**¿Tienes problemas?** Ver `DEVELOPMENT.md` para troubleshooting.
