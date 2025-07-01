"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import logoMedellin from '@/assets/logo-medellin.png';
import ActividadesPage from './ActividadesPage';

// Datos del sistema SSC
const sscData = {
  "cuos": [
    {
      "CUO_ID": 1,
      "CUO_CON_ID": 1,
      "CUO_NRO": "CUO-001-IV",
      "CUO_LATITUD": 6.2442,
      "CUO_LONGITUD": -75.5812,
      "CUO_COMUNA": "Comuna 10 - La Candelaria",
      "CUO_BARRIO": "Centro",
      "CUO_DESCRIPCION": "Centro urbano principal para gestión de infraestructura verde en el centro de la ciudad"
    },
    {
      "CUO_ID": 2,
      "CUO_CON_ID": 1,
      "CUO_NRO": "CUO-002-IV",
      "CUO_LATITUD": 6.2518,
      "CUO_LONGITUD": -75.5636,
      "CUO_COMUNA": "Comuna 4 - Aranjuez",
      "CUO_BARRIO": "Aranjuez",
      "CUO_DESCRIPCION": "Centro de operaciones para la zona norte, gestión de parques y zonas verdes"
    },
    {
      "CUO_ID": 3,
      "CUO_CON_ID": 2,
      "CUO_NRO": "CUO-001-MS",
      "CUO_LATITUD": 6.2486,
      "CUO_LONGITUD": -75.5647,
      "CUO_COMUNA": "Comuna 10 - La Candelaria",
      "CUO_BARRIO": "Prado",
      "CUO_DESCRIPCION": "Centro de operaciones para construcción de ciclorrutas sector A"
    }
  ]
};

// Interfaces
interface CUO {
  CUO_ID: number;
  CUO_CON_ID: number;
  CUO_NRO: string;
  CUO_LATITUD: number;
  CUO_LONGITUD: number;
  CUO_COMUNA: string;
  CUO_BARRIO: string;
  CUO_DESCRIPCION: string;
}

interface FrenteObraPageProps {
  contratoId: string;
  onBackToContract: () => void;
}

export default function FrenteObraPage({ contratoId, onBackToContract }: FrenteObraPageProps) {
  // Estados
  const [userRole] = useState('supervisor');
  const [selectedCUO, setSelectedCUO] = useState<CUO | null>(null);
  const [cuos, setCuos] = useState<CUO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleBackToCUOs = () => {
    setSelectedCUO(null);
  };

  // Cargar CUOs del contrato
  useEffect(() => {
    if (!contratoId) return;

    setIsLoading(true);
    setTimeout(() => {
      const cuosDelContrato = sscData.cuos.filter(cuo => 
        cuo.CUO_CON_ID.toString() === contratoId
      );
      setCuos(cuosDelContrato);
      setIsLoading(false);
    }, 1000);
  }, [contratoId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div className="flex flex-col space-y-8 transform -rotate-0 translate-x-[-10%] translate-y-[0%] scale-150">
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex space-x-16 whitespace-nowrap">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <span key={colIndex} className="text-blue-900 text-4xl font-bold select-none">
                    {rowIndex % 2 === 0 ? 'MEDELLIN' : 'TE QUIERE'}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <header className="bg-blue-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-800 rounded-lg p-3 shadow-lg">
                  <Image
                    src={logoMedellin}
                    alt="Alcaldía de Medellín"
                    width={56}
                    height={70}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className="w-px h-24 bg-white opacity-50"></div>
                <div className="text-white">
                  <h1 className="text-5xl font-bold">SIF</h1>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className="text-white text-base">
                  Bienvenido, {userRole}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-sm"
                >
                  <span>Cerrar Sesión</span>
                  <span className="text-base">⊗</span>
                </button>
              </div>
            </div>
          </header>

          <main className="px-8 py-8">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center text-xl font-medium animate-pulse text-gray-500">
                Cargando frentes de obra...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="flex flex-col space-y-8 transform -rotate-0 translate-x-[-10%] translate-y-[0%] scale-150">
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex space-x-16 whitespace-nowrap">
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <span key={colIndex} className="text-blue-900 text-4xl font-bold select-none">
                  {rowIndex % 2 === 0 ? 'MEDELLIN' : 'TE QUIERE'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <header className="bg-blue-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-800 rounded-lg p-3 shadow-lg">
                <Image
                  src={logoMedellin}
                  alt="Alcaldía de Medellín"
                  width={56}
                  height={70}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="w-px h-24 bg-white opacity-50"></div>
              <div className="text-white">
                <h1 className="text-5xl font-bold">SIF</h1>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span className="text-white text-base">
                Bienvenido, {userRole}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-sm"
              >
                <span>Cerrar Sesión</span>
                <span className="text-base">⊗</span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-8 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {/* Vista de actividades */}
            {selectedCUO ? (
              <div className="space-y-4">
                <button
                  onClick={handleBackToCUOs}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>←</span>
                  <span>Volver a Frentes de Obra</span>
                </button>
                <ActividadesPage 
                  cuoId={selectedCUO.CUO_ID.toString()}
                  onBackToFrente={handleBackToCUOs}
                />
              </div>
            
            /* Vista de CUOs */
            ) : (
              <>
                <div className="flex items-center mb-8">
                  <button
                    onClick={onBackToContract}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 mr-4"
                  >
                    <span>←</span>
                    <span>Volver al Contrato</span>
                  </button>
                  <h2 className="text-4xl font-bold text-gray-800">
                    ¿Qué <span className="text-orange-500">Frente de Obra</span> deseas seguir?
                  </h2>
                </div>
                
                {cuos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cuos.map((cuo) => (
                      <div key={cuo.CUO_ID} className="bg-blue-600 text-white rounded-xl p-6 shadow-lg flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{cuo.CUO_NRO}</h3>
                          <p className="text-lg mb-2">{cuo.CUO_BARRIO}</p>
                          <p className="text-sm text-white/80 mb-2">{cuo.CUO_COMUNA}</p>
                          <p className="text-sm text-white/70">{cuo.CUO_DESCRIPCION}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCUO(cuo)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg w-full mt-4"
                        >
                          Seleccionar Frente
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-xl font-medium text-gray-500">
                    No hay frentes de obra para este contrato.
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 