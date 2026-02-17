import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catequesis</h1>
          <p className="text-gray-600">Sistema de Gestión Parroquial</p>
        </div>
        <LoginForm />
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Credenciales de prueba (por favor reemplazar en producción):
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            Email: <code className="bg-gray-100 px-2 py-1 rounded">admin@parroquia.local</code>
          </p>
        </div>
      </div>
    </div>
  );
}
