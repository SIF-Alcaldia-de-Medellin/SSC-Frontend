"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AgregarAdicionPage from '../components/Dashboards/AgregarAdicion';

function AgregarAdicionContent() {
  const searchParams = useSearchParams();
  const contratoId = searchParams.get('contrato');
  
  return <AgregarAdicionPage contratoId={contratoId} />;
}

export default function AgregarAdicionPageRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando formulario de adición...</p>
        </div>
      </div>
    }>
      <AgregarAdicionContent />
    </Suspense>
  );
} 