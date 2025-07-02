"use client";
import PublicRoute from '@/components/PublicRoute';

export default function RegistroPage() {
  return (
    <PublicRoute redirectIfAuthenticated="/dashboard">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Registro de Usuario
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            Esta es una página pública. Si ya estuvieras autenticado, 
            serías redirigido al dashboard.
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
} 