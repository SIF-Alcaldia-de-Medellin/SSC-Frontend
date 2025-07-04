"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SeguimientoGeneralPage from '../components/Dashboards/SeguimientoGeneral';

function SeguimientoGeneralContent() {
  const searchParams = useSearchParams();
  const contratoId = searchParams.get('contrato');
  
  return <SeguimientoGeneralPage contratoId={contratoId} />;
}

export default function SeguimientoGeneral() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando seguimiento general...</p>
        </div>
      </div>
    }>
      <SeguimientoGeneralContent />
    </Suspense>
  );
} 