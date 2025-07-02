"use client";

import { useState, useEffect } from 'react';
import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Datos del sistema SSC
const sscData = {
  "seguimiento_actividades": [
    {
      "SEG_ID": 1,
      "SEG_ACT_ID": 1,
      "SEG_AVANCE_FISICO": 45.5,
      "SEG_COSTO_APROXIMADO": 202500000,
      "SEG_CREATED_AT": "2025-01-20T14:30:00Z",
      "SEG_DESCRIPCION_SEGUIMIENTO": "Avance satisfactorio en mantenimiento de zonas verdes. Se han intervenido 1125 m² de los 2500 programados.",
      "SEG_PROYECCION_ACTIVIDADES": "Se espera completar el 60% para fin de mes con buen clima."
    },
    {
      "SEG_ID": 2,
      "SEG_ACT_ID": 2,
      "SEG_AVANCE_FISICO": 30.0,
      "SEG_COSTO_APROXIMADO": 60000000,
      "SEG_CREATED_AT": "2025-01-20T14:30:00Z",
      "SEG_DESCRIPCION_SEGUIMIENTO": "Instalación de mobiliario urbano iniciada. 45 de 150 unidades instaladas.",
      "SEG_PROYECCION_ACTIVIDADES": "Cronograma normal, entrega de materiales según programación."
    }
  ],
  "actividades": [
    {
      "ACT_ID": 1,
      "ACT_PROYECTADO_FINANCIERO": 450000000
    },
    {
      "ACT_ID": 2,
      "ACT_PROYECTADO_FINANCIERO": 200000000
    }
  ]
};

// Interfaces
interface ActividadData {
  id: string;
  nombre: string;
  costoTotal: number;
  costoAcumulado: number;
  avanceFisicoAcumulado: number;
  descripcionAnterior?: string;
  actividadesProyectadasAnteriores?: string;
}

interface SeguimientoAvanceProps {
  actividadId?: string;
  nombreActividad?: string;
  actividadData?: ActividadData;
  onSubmit?: (data: {
    actividadId: string;
    costoAcumulado: string;
    avanceFisico: number;
    descripcion: string;
    actividadesProyectadas: string;
  }) => void;
  isLoading?: boolean;
  onBackToActividades?: () => void;
}

export default function SeguimientoAvance({ 
  actividadId, 
  nombreActividad, 
  actividadData,
  onSubmit,
  isLoading = false,
  onBackToActividades
}: SeguimientoAvanceProps) {
  // Estados de formulario
  const [descripcion, setDescripcion] = useState("");
  const [actividadesProyectadas, setActividadesProyectadas] = useState("");
  
  // Estados de datos
  const [costoAcumulado, setCostoAcumulado] = useState("0");
  const [costoTotal, setCostoTotal] = useState("0");
  const [avanceFisico, setAvanceFisico] = useState(0);
  
  // Estados de control
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos cuando cambia actividadData
  useEffect(() => {
    if (actividadData) {
      setCostoAcumulado(actividadData.costoAcumulado.toLocaleString('es-CO'));
      setCostoTotal(actividadData.costoTotal.toLocaleString('es-CO'));
      setAvanceFisico(actividadData.avanceFisicoAcumulado);
      setDescripcion(actividadData.descripcionAnterior || "");
      setActividadesProyectadas(actividadData.actividadesProyectadasAnteriores || "");
      setError(null);
    }
  }, [actividadData]);

  // Cargar datos del sistema SSC
  useEffect(() => {
    if (actividadId && !actividadData) {
      fetchActividadData(actividadId);
    }
  }, [actividadId, actividadData]);

  // Obtener datos de actividad
  const fetchActividadData = async (id: string) => {
    try {
      setError(null);
      
      const seguimiento = sscData.seguimiento_actividades.find(seg => 
        seg.SEG_ACT_ID.toString() === id
      );
      
      const actividad = sscData.actividades.find(act => 
        act.ACT_ID.toString() === id
      );
      
      setTimeout(() => {
        if (seguimiento && actividad) {
          setCostoAcumulado(seguimiento.SEG_COSTO_APROXIMADO.toLocaleString('es-CO'));
          setCostoTotal(actividad.ACT_PROYECTADO_FINANCIERO.toLocaleString('es-CO'));
          setAvanceFisico(seguimiento.SEG_AVANCE_FISICO);
          setDescripcion(seguimiento.SEG_DESCRIPCION_SEGUIMIENTO || "");
          setActividadesProyectadas(seguimiento.SEG_PROYECCION_ACTIVIDADES || "");
        } else {
          setCostoAcumulado((Math.floor(Math.random() * 50000000) + 10000000).toLocaleString('es-CO'));
          setCostoTotal((100000000).toLocaleString('es-CO'));
          setAvanceFisico(Math.floor(Math.random() * 80) + 10);
        }
      }, 1000);
      
    } catch (err) {
      setError("Error al cargar los datos de la actividad");
      console.error("Error fetching actividad data:", err);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        actividadId: actividadId || "",
        costoAcumulado,
        avanceFisico,
        descripcion,
        actividadesProyectadas
      };

      if (onSubmit) {
        await onSubmit(submitData);
      } else {
        console.log("Enviando datos:", submitData);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      alert("Seguimiento guardado exitosamente");
    } catch (err) {
      setError("Error al guardar el seguimiento");
      console.error("Error submitting data:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-r pr-8">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="pl-8">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

     return (
     <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
      <h2 
        className={`${workSans.className} text-gray-800 text-center mb-6 align-middle`}
        style={{
          fontWeight: 700,
          fontSize: '48.83px',
          lineHeight: '100%',
          letterSpacing: '0%',
          textAlign: 'center',
          verticalAlign: 'middle'
        }}
      >
        Seguimiento de Avance Físico por Actividad
        {nombreActividad && (
          <span className="block text-lg text-blue-600 mt-1">{nombreActividad}</span>
        )}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Costos */}
          <div className="border-r pr-8">
            <h3 
              className={`${workSans.className} text-green-700 mb-2 align-middle`}
              style={{
                fontWeight: 600,
                fontSize: '31.25px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              Costos
              <br />
              Acumulado:
            </h3>
            <p className="text-center text-4xl font-bold text-green-600 mb-4">
              ${costoAcumulado}
            </p>
            
            <div className="border-t border-gray-300 pt-4">
                             <label 
                 className={`${workSans.className} block text-gray-700 mb-2 align-middle`}
                 style={{
                   fontWeight: 600,
                   fontSize: '20px',
                   lineHeight: '100%',
                   letterSpacing: '0%',
                   textAlign: 'center',
                   verticalAlign: 'middle'
                 }}
               >
                 <span className="text-red-600 text-xl font-bold">*</span>Costo aproximado
               </label>
                             <input
                 type="number"
                 placeholder="0"
                 className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
               />
            </div>
          </div>

          {/* Avance Físico */}
          <div className="pl-8">
            <h3 
              className={`${workSans.className} text-orange-700 mb-2 align-middle`}
              style={{
                fontWeight: 600,
                fontSize: '31.25px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              Avance Físico
              <br />
              Acumulado:
            </h3>
            <p className="text-center text-4xl font-bold text-orange-600 mb-4">
              {avanceFisico}m
            </p>
            
            <div className="border-t border-gray-300 pt-4">
                             <label 
                 className={`${workSans.className} block text-gray-700 mb-2 align-middle`}
                 style={{
                   fontWeight: 600,
                   fontSize: '20px',
                   lineHeight: '100%',
                   letterSpacing: '0%',
                   textAlign: 'center',
                   verticalAlign: 'middle'
                 }}
               >
                 <span className="text-red-600 text-xl font-bold">*</span>Avance Físico
               </label>
                             <input
                 type="number"
                 placeholder="0"
                 className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
               />
            </div>
          </div>
        </div>

        {/* Descripción */}
                 <div className="space-y-2">
           <label 
             className={`${workSans.className} block text-gray-700 mb-2 align-middle`}
             style={{
               fontWeight: 600,
               fontSize: '20px',
               lineHeight: '100%',
               letterSpacing: '0%',
               textAlign: 'left',
               verticalAlign: 'middle'
             }}
           >
             <span className="text-red-600 text-xl font-bold">*</span>Descripción del Seguimiento:
           </label>
                     <textarea
             value={descripcion}
             onChange={(e) => setDescripcion(e.target.value)}
             className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             rows={4}
             required
             placeholder="Describe el estado actual y observaciones del seguimiento..."
           />
        </div>

        {/* Actividades Proyectadas */}
                 <div className="space-y-2">
           <label 
             className={`${workSans.className} block text-gray-700 mb-2 align-middle`}
             style={{
               fontWeight: 600,
               fontSize: '20px',
               lineHeight: '100%',
               letterSpacing: '0%',
               textAlign: 'left',
               verticalAlign: 'middle'
             }}
           >
             <span className="text-red-600 text-xl font-bold">*</span>Actividades Proyectadas:
           </label>
                     <textarea
             value={actividadesProyectadas}
             onChange={(e) => setActividadesProyectadas(e.target.value)}
             className="w-full p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             rows={4}
             required
             placeholder="Describe las actividades planificadas para el próximo período..."
           />
        </div>

        {/* Botones */}
        <div className="flex justify-between">
                     {onBackToActividades && (
             <button
               type="button"
               onClick={onBackToActividades}
               className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-full transition-colors duration-200"
             >
               Volver a Actividades
             </button>
           )}
           <button
             type="submit"
             disabled={isSubmitting}
             className={`font-semibold px-6 py-2 rounded-full transition-colors duration-200 ml-auto ${
               isSubmitting 
                 ? "bg-gray-400 cursor-not-allowed" 
                 : "bg-blue-600 hover:bg-blue-700"
             } text-white`}
           >
             {isSubmitting ? "Guardando..." : "Enviar"}
           </button>
        </div>
      </form>
    </div>
  );
} 