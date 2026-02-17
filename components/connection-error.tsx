'use client';

import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConnectionErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ConnectionError({ message, onRetry }: ConnectionErrorProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          Error de Conexión
        </CardTitle>
        <CardDescription className="text-red-600">
          No se pudo conectar a la base de datos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-700 bg-white p-3 rounded border border-red-200">
            {message}
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold">Para resolver este problema:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Verifica que tienes configuradas las credenciales MSSQL en tu archivo .env.local</li>
              <li>Asegúrate de que el servidor MSSQL está accesible</li>
              <li>Revisa que el nombre de la base de datos sea correcto</li>
              <li>Recarga la página después de configurar las variables de entorno</li>
            </ol>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="w-full">
              Reintentar Conexión
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
