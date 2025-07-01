"use client";

import { useState, useEffect } from 'react';
import SeguimientoAvance from './SeguimientoAvance';

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
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            ¿Qué <span className="text-fuchsia-600">actividad</span> deseas seguir?
          </h2>

          {actividades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actividades.map((actividad) => (
                <div key={actividad.ACT_ID} className="bg-cyan-600 text-white rounded-xl p-6 shadow-lg space-y-2">
                  <h3 className="text-xl font-bold">ACT #{actividad.ACT_ID}</h3>
                  <p className="text-lg">{actividad.ACT_ACTIVIDAD}</p>
                  <p className="text-sm text-white/80">
                    Meta física: {actividad.ACT_METAFISICA} {actividad.ACT_UNIDADES_AVANCE}
                  </p>
                  <p className="font-semibold text-white">
                    Valor: {formatearValor(actividad.ACT_PROYECTADO_FINANCIERO)}
                  </p>
                  <button
                    onClick={() => setSelectedActivity(actividad)}
                    className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold px-4 py-2 rounded-lg w-full"
                  >
                    Seleccionar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedActivity(null)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
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