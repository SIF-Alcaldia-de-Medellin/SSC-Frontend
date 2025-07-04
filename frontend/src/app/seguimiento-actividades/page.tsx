"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FrenteObraPage from '@/app/components/Dashboards/FrenteObraPage';

function SeguimientoActividadesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contratoId = searchParams.get('contrato');
  const [isLoading, setIsLoading] = useState(true);

  // Verificaciones iniciales
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    if (!contratoId) {
      router.push('/home');
      return;
    }

    setIsLoading(false);
  }, [router, contratoId]);

  // Handler para volver al contrato
  const handleBackToContract = () => {
    router.push(`/contratos?id=${contratoId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando seguimiento de actividades...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!contratoId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Contrato no especificado</h2>
          <button 
            onClick={() => router.push('/home')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Regresar al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <FrenteObraPage 
      contratoId={contratoId}
      onBackToContract={handleBackToContract}
    />
  );
}

export default function SeguimientoActividadesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando seguimiento de actividades...</p>
        </div>
      </div>
    }>
      <SeguimientoActividadesContent />
    </Suspense>
  );
} 