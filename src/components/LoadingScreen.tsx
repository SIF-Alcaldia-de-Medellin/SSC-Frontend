"use client";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Spinner */}
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
        
        {/* Texto */}
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Cargando SSC
        </h2>
        <p className="text-gray-500">
          Sistema de Seguimiento de Contratos
        </p>
        
        {/* Puntos animados */}
        <div className="mt-4 flex justify-center space-x-1">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
} 