"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function TestNavigationPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pattern p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Prueba de Navegación
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Páginas Protegidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/dashboard" 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium">Dashboard</h3>
                <p className="text-sm text-gray-600">Página principal</p>
              </Link>
              
              <Link 
                href="/contratos" 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium">Contratos</h3>
                <p className="text-sm text-gray-600">Gestión de contratos</p>
              </Link>
              
              <Link 
                href="/test-navigation" 
                className="p-4 border border-blue-200 bg-blue-50 rounded-lg"
              >
                <h3 className="font-medium">Esta Página</h3>
                <p className="text-sm text-gray-600">Página actual</p>
              </Link>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">✅ Funcionamiento Correcto</h3>
            <p className="text-green-700 text-sm">
              Si puedes ver esta página, significa que la navegación entre páginas protegidas funciona correctamente.
              Ya no deberías ser redirigido automáticamente al dashboard.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 