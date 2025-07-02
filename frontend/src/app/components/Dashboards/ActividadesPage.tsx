"use client";

import { useState, useEffect } from 'react';
import { Work_Sans } from 'next/font/google';
import SeguimientoAvance from './SeguimientoAvance';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

// Datos del sistema SSC
const sscData = {
  "actividades": [
    {
      "ACT_ID": 1,
      "ACT_CUO_ID": 1,
      "ACT_ACTIVIDAD": "Mantenimiento de zonas verdes existentes",
      "ACT_METAFISICA": 2500.5,
      "ACT_PROYECTADO_FINANCIERO": 450000000,
      "ACT_UNIDADES_AVANCE": "metros cuadrados"
    },
    {
      "ACT_ID": 2,
      "ACT_CUO_ID": 1,
      "ACT_ACTIVIDAD": "Instalación de nuevo mobiliario urbano",
      "ACT_METAFISICA": 150.0,
      "ACT_PROYECTADO_FINANCIERO": 200000000,
      "ACT_UNIDADES_AVANCE": "unidades"
    },
    {
      "ACT_ID": 3,
      "ACT_CUO_ID": 2,
      "ACT_ACTIVIDAD": "Siembra de árboles nativos",
      "ACT_METAFISICA": 300.0,
      "ACT_PROYECTADO_FINANCIERO": 150000000,
      "ACT_UNIDADES_AVANCE": "unidades"
    },
    {
      "ACT_ID": 4,
      "ACT_CUO_ID": 3,
      "ACT_ACTIVIDAD": "Construcción de ciclorruta principal",
      "ACT_METAFISICA": 5200.0,
      "ACT_PROYECTADO_FINANCIERO": 1800000000,
      "ACT_UNIDADES_AVANCE": "metros lineales"
    }
  ]
};

// Interfaces
interface Actividad { 
  ACT_ID: number;
  ACT_CUO_ID: number;
  ACT_ACTIVIDAD: string;
  ACT_METAFISICA: number;
  ACT_PROYECTADO_FINANCIERO: number;
  ACT_UNIDADES_AVANCE: string;
}

// Componentes UI
const LoadingState = () => <p className="text-center text-xl font-medium animate-pulse text-gray-500">Cargando actividades...</p>;
const EmptyState = () => <p className="text-center text-xl font-medium text-gray-500">No hay actividades para este frente de obra.</p>;

interface ActividadesPageProps {
  cuoId: string;
  onBackToFrente: () => void;
}

export default function ActividadesPage({ cuoId }: ActividadesPageProps) {
  // Estados
  const [selectedActivity, setSelectedActivity] = useState<Actividad | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar actividades del CUO
  useEffect(() => {
    if (!cuoId) return;

    setIsLoading(true);
    setTimeout(() => {
      const actividadesDelCUO = sscData.actividades.filter(actividad => 
        actividad.ACT_CUO_ID.toString() === cuoId
      );
      setActividades(actividadesDelCUO);
      setIsLoading(false);
    }, 1000);
  }, [cuoId]);

  // Formatear valores
  const formatearValor = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {!selectedActivity ? (
        <div>
          <h2 
            className={`${workSans.className} text-gray-800 text-center mb-8 align-middle`}
            style={{
              fontWeight: 700,
              fontSize: '48.83px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            ¿Qué <span className="text-fuchsia-600">actividad</span> deseas seguir?
          </h2>

          {actividades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {actividades.map((actividad, index) => {
                const isDarkBlue = index % 2 === 0;
                const bgColor = isDarkBlue ? 'bg-blue-400' : 'bg-sky-500';
                const hoverColor = isDarkBlue ? 'hover:bg-blue-500' : 'hover:bg-sky-600';
                
                return (
                                     <div key={actividad.ACT_ID} className={`${bgColor} ${hoverColor} text-white rounded-2xl p-8 shadow-xl transition-all duration-300 transform hover:scale-105 h-96 flex flex-col justify-between`}>
                                          <div className="flex-1 flex flex-col">
                        <div>
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
                            ACT #{actividad.ACT_ID}
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
                            {actividad.ACT_ACTIVIDAD}
                          </h4>
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
                            <span className="font-medium">Meta física:</span> {actividad.ACT_METAFISICA} {actividad.ACT_UNIDADES_AVANCE}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end">
                          <p 
                            className={`${workSans.className} align-middle w-full`}
                            style={{
                              fontWeight: 600,
                              fontSize: '28px',
                              lineHeight: '100%',
                              letterSpacing: '0%',
                              textAlign: 'right',
                              verticalAlign: 'middle'
                            }}
                          >
                            <span className="font-medium">Valor proyectado:</span> {formatearValor(actividad.ACT_PROYECTADO_FINANCIERO)}
                          </p>
                        </div>
                     </div>
                                            <button
                         onClick={() => setSelectedActivity(actividad)}
                         className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full w-full mt-6 transition-colors duration-200 shadow-lg"
                       >
                         Seleccionar
                       </button>
                   </div>
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedActivity(null)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-200"
          >
            <span>←</span>
            <span>Volver a Actividades</span>
          </button>
          <SeguimientoAvance
            actividadId={selectedActivity.ACT_ID.toString()}
            nombreActividad={selectedActivity.ACT_ACTIVIDAD}
            onBackToActividades={() => setSelectedActivity(null)}
          />
        </div>
      )}
    </div>
  );
} 