#!/bin/bash

echo "==================================="
echo "Inicializando Sistema de Catequesis"
echo "==================================="

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Crear .env.local si no existe
if [ ! -f .env.local ]; then
  echo "Creando archivo .env.local..."
  cp .env.example .env.local
  echo "Por favor, edita .env.local con tus credenciales MSSQL"
fi

# Mensaje final
echo ""
echo "==================================="
echo "Instalación completada!"
echo "==================================="
echo ""
echo "Próximos pasos:"
echo "1. Edita .env.local con tus credenciales MSSQL"
echo "2. Ejecuta: npm run dev"
echo "3. Abre: http://localhost:3000"
echo ""
echo "Credenciales de prueba (modo desarrollo):"
echo "  Email: admin@parroquia.local"
echo "  Contraseña: test123"
echo ""
