# Guía de Testing - API Endpoints

Ejemplos de cómo probar los endpoints de la API usando cURL o Postman.

## 1. Autenticación

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@parroquia.local",
    "password": "tu-contraseña"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@parroquia.local",
    "role": "admin",
    "fullName": "Administrador"
  }
}
```

### Obtener Usuario Actual

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 2. Alumnos

### Listar Todos

```bash
curl -X GET http://localhost:3000/api/alumnos \
  -H "Authorization: Bearer <tu-token>"
```

### Crear Alumno

```bash
curl -X POST http://localhost:3000/api/alumnos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez García",
    "email": "juan@ejemplo.com",
    "phone": "1234567890",
    "dateOfBirth": "2010-05-15",
    "classId": 1
  }'
```

### Actualizar Alumno

```bash
curl -X PUT http://localhost:3000/api/alumnos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez García",
    "email": "juan.nuevo@ejemplo.com",
    "phone": "9876543210",
    "dateOfBirth": "2010-05-15",
    "classId": 2
  }'
```

### Eliminar Alumno

```bash
curl -X DELETE http://localhost:3000/api/alumnos/1 \
  -H "Authorization: Bearer <tu-token>"
```

### Obtener Progenitores de Alumno

```bash
curl -X GET http://localhost:3000/api/alumnos/1/progenitores \
  -H "Authorization: Bearer <tu-token>"
```

## 3. Maestros

### Listar Todos

```bash
curl -X GET http://localhost:3000/api/maestros \
  -H "Authorization: Bearer <tu-token>"
```

### Crear Maestro

```bash
curl -X POST http://localhost:3000/api/maestros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "firstName": "María",
    "lastName": "López García",
    "email": "maria@parroquia.local",
    "phone": "1234567890",
    "specialization": "Catecismo"
  }'
```

### Actualizar Maestro

```bash
curl -X PUT http://localhost:3000/api/maestros/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "firstName": "María",
    "lastName": "López García",
    "email": "maria.updated@parroquia.local",
    "phone": "9876543210",
    "specialization": "Liturgia"
  }'
```

### Eliminar Maestro

```bash
curl -X DELETE http://localhost:3000/api/maestros/1 \
  -H "Authorization: Bearer <tu-token>"
```

## 4. Aulas

### Listar Todas

```bash
curl -X GET http://localhost:3000/api/aulas \
  -H "Authorization: Bearer <tu-token>"
```

### Crear Aula

```bash
curl -X POST http://localhost:3000/api/aulas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "name": "Aula 1 - Primaria",
    "description": "Clase para alumnos de primaria",
    "capacity": 25,
    "teacherId": 1,
    "level": "Primaria"
  }'
```

### Actualizar Aula

```bash
curl -X PUT http://localhost:3000/api/aulas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "name": "Aula 1 - Primaria Avanzada",
    "description": "Clase para alumnos de primaria avanzada",
    "capacity": 30,
    "teacherId": 2,
    "level": "Primaria"
  }'
```

### Eliminar Aula

```bash
curl -X DELETE http://localhost:3000/api/aulas/1 \
  -H "Authorization: Bearer <tu-token>"
```

## 5. Progenitores

### Listar Todos

```bash
curl -X GET http://localhost:3000/api/progenitores \
  -H "Authorization: Bearer <tu-token>"
```

### Crear Progenitor

```bash
curl -X POST http://localhost:3000/api/progenitores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "firstName": "Carlos",
    "lastName": "Pérez",
    "email": "carlos@ejemplo.com",
    "phone": "1234567890",
    "relationship": "Padre",
    "address": "Calle Principal 123",
    "city": "Madrid",
    "postalCode": "28001",
    "emergencyPhone": "9876543210",
    "studentId": 1
  }'
```

### Actualizar Progenitor

```bash
curl -X PUT http://localhost:3000/api/progenitores/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "firstName": "Carlos",
    "lastName": "Pérez García",
    "email": "carlos.updated@ejemplo.com",
    "phone": "1111111111",
    "relationship": "Padre",
    "address": "Calle Nueva 456",
    "city": "Madrid",
    "postalCode": "28002",
    "emergencyPhone": "2222222222",
    "studentId": 1
  }'
```

### Eliminar Progenitor

```bash
curl -X DELETE http://localhost:3000/api/progenitores/1 \
  -H "Authorization: Bearer <tu-token>"
```

## 6. Usuarios (Admin Only)

### Listar Todos

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <tu-token>"
```

### Crear Usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "email": "nuevousuario@parroquia.local",
    "password": "contraseña-segura-123",
    "role": "teacher"
  }'
```

### Eliminar Usuario

```bash
curl -X DELETE http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer <tu-token>"
```

## 7. Reportes

### Generar Reporte PDF

```bash
curl -X POST http://localhost:3000/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "reportType": "alumnos",
    "format": "pdf"
  }' \
  --output reporte-alumnos.pdf
```

### Generar Reporte Excel

```bash
curl -X POST http://localhost:3000/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "reportType": "maestros",
    "format": "excel"
  }' \
  --output reporte-maestros.xlsx
```

## Tipos de Reportes Disponibles

- `alumnos` - Listado completo de alumnos
- `maestros` - Listado completo de maestros
- `aulas` - Listado completo de aulas
- `progenitores` - Listado completo de progenitores
- `asistencia` - Reporte de asistencia

## Formatos de Exportación

- `pdf` - Archivo PDF
- `excel` - Archivo Excel (.xlsx)

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado exitosamente |
| 400 | Solicitud incorrecta (datos faltantes o inválidos) |
| 401 | No autenticado (token faltante o inválido) |
| 403 | Prohibido (sin permisos suficientes) |
| 404 | No encontrado |
| 500 | Error interno del servidor |

## Tips para Testing

### Con Postman

1. Importa los ejemplos anteriores como requests
2. Configura una variable `{{token}}` con tu JWT
3. Usa la variable en el header `Authorization: Bearer {{token}}`
4. Guarda requests frecuentes en colecciones

### Con Insomnia

Similar a Postman, pero también puedes:
1. Crear un archivo `.http` con las requests
2. Ejecutar las requests directamente desde VSCode con la extensión "REST Client"

### Ejemplo para VSCode REST Client

Crea un archivo `requests.http`:

```http
@baseUrl = http://localhost:3000
@token = <tu-token-aqui>

### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@parroquia.local",
  "password": "contraseña"
}

### Listar Alumnos
GET {{baseUrl}}/api/alumnos
Authorization: Bearer {{token}}
```

## Valores de Prueba

Para facilitar el testing, usa estos valores:

- **Email Admin**: admin@parroquia.local
- **Email Maestro**: maestro@parroquia.local
- **Email Secretaría**: secretaria@parroquia.local
- **Roles**: admin, teacher (maestro), secretary (secretaría)
- **Relaciones (Progenitores)**: Padre, Madre, Tutor, Otro
- **Niveles (Aulas)**: Infantil, Primaria, Secundaria, Bachillerato
