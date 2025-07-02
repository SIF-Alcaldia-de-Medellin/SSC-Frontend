"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';
import ActividadesPage from './ActividadesPage';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

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
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="flex flex-col space-y-4 transform -rotate-0 translate-x-[-5%] translate-y-[0%] scale-[2] min-h-full">
            {Array.from({ length: 20 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex space-x-8 whitespace-nowrap">
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <span key={colIndex} className="text-blue-900 text-5xl font-black select-none tracking-[-0.1em] font-sans">
                    {rowIndex % 2 === 0 ? 'MEDELLIN' : 'TE QUIERE'}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <header className="bg-blue-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-900 rounded-lg p-2 shadow-lg">
                  <Image
                    src={logoMedellin}
                    alt="Alcaldía de Medellín"
                    width={96}
                    height={120}
                    className="w-24 h-30 object-contain"
                  />
                </div>
                <div className="w-px h-20 bg-white opacity-50"></div>
                <div className="text-white">
                  <h1 
                    className={`${workSans.className} text-white`}
                    style={{
                      fontWeight: 800,
                      fontSize: '95.37px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}
                  >
                    SIF
                  </h1>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className="text-white text-base">
                  Bienvenido, {userRole}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full flex items-center space-x-2 transition-colors duration-200 text-sm"
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 relative pb-20">
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="flex flex-col space-y-4 transform -rotate-0 translate-x-[-5%] translate-y-[0%] scale-[2] min-h-full">
          {Array.from({ length: 20 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex space-x-8 whitespace-nowrap">
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <span key={colIndex} className="text-blue-900 text-5xl font-black select-none tracking-[-0.1em] font-sans">
                  {rowIndex % 2 === 0 ? 'MEDELLIN' : 'TE QUIERE'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <header className="bg-blue-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-900 rounded-lg p-2 shadow-lg">
                <Image
                  src={logoMedellin}
                  alt="Alcaldía de Medellín"
                  width={96}
                  height={120}
                  className="w-24 h-30 object-contain"
                />
              </div>
              <div className="w-px h-20 bg-white opacity-50"></div>
              <div className="text-white">
                <h1 
                  className={`${workSans.className} text-white`}
                  style={{
                    fontWeight: 800,
                    fontSize: '95.37px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}
                >
                  SIF
                </h1>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span className="text-white text-base">
                Bienvenido, {userRole}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full flex items-center space-x-2 transition-colors duration-200 text-sm"
              >
                <span>Cerrar Sesión</span>
                <span className="text-base">⊗</span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-8 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-2xl relative">
            {/* Vista de actividades */}
            {selectedCUO ? (
              <div className="space-y-4">
                <button
                  onClick={handleBackToCUOs}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-200"
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
                <div className="flex justify-center mb-8">
                  <button
                    onClick={onBackToContract}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-200 absolute left-8"
                  >
                    <span>←</span>
                    <span>Volver al Contrato</span>
                  </button>
                  <h2 
                    className={`${workSans.className} text-gray-800 text-center align-middle`}
                    style={{
                      fontWeight: 700,
                      fontSize: '48.83px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}
                  >
                    ¿Qué <span className="text-orange-500">Frente de Obra</span> deseas seguir?
                  </h2>
                </div>
                
                {cuos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cuos.map((cuo, index) => {
                      const isDarkBlue = index % 2 === 0;
                      const bgColor = isDarkBlue ? 'bg-blue-400' : 'bg-sky-500';
                      const hoverColor = isDarkBlue ? 'hover:bg-blue-500' : 'hover:bg-sky-600';
                      
                      return (
                        <div key={cuo.CUO_ID} className={`${bgColor} ${hoverColor} text-white rounded-2xl p-8 shadow-xl transition-all duration-300 transform hover:scale-105 h-96 flex flex-col justify-between`}>
                          <div className="flex-1">
                            <h3 
                              className={`${workSans.className} text-left mb-4 align-middle`}
                              style={{
                                fontWeight: 700,
                                fontSize: '31.25px',
                                lineHeight: '100%',
                                letterSpacing: '0%',
                                verticalAlign: 'middle'
                              }}
                            >
                              {cuo.CUO_NRO}
                            </h3>
                                                         <h4 
                               className={`${workSans.className} text-left mb-4 align-middle`}
                               style={{
                                 fontWeight: 600,
                                 fontSize: '25px',
                                 lineHeight: '100%',
                                 letterSpacing: '0%',
                                 verticalAlign: 'middle'
                               }}
                             >
                               {cuo.CUO_BARRIO}
                             </h4>
                                                         <p 
                               className={`${workSans.className} text-left mb-4 align-middle`}
                               style={{
                                 fontWeight: 400,
                                 fontSize: '16px',
                                 lineHeight: '100%',
                                 letterSpacing: '0%',
                                 verticalAlign: 'middle'
                               }}
                             >
                               {cuo.CUO_DESCRIPCION}
                             </p>
                                                         <p 
                               className={`${workSans.className} text-left mb-2 align-middle`}
                               style={{
                                 fontWeight: 400,
                                 fontSize: '16px',
                                 lineHeight: '100%',
                                 letterSpacing: '0%',
                                 verticalAlign: 'middle'
                               }}
                             >
                               <span className="font-medium">Comuna:</span> {cuo.CUO_COMUNA}
                             </p>
                             <p 
                               className={`${workSans.className} text-left align-middle`}
                               style={{
                                 fontWeight: 400,
                                 fontSize: '16px',
                                 lineHeight: '100%',
                                 letterSpacing: '0%',
                                 verticalAlign: 'middle'
                               }}
                             >
                               <span className="font-medium">Coordenadas:</span> {cuo.CUO_LATITUD}, {cuo.CUO_LONGITUD}
                             </p>
                          </div>
                          <button
                            onClick={() => setSelectedCUO(cuo)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full w-full mt-6 transition-colors duration-200 shadow-lg"
                          >
                            Seleccionar
                          </button>
                        </div>
                      );
                    })}
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