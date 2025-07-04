"use client";

import { useState, useEffect } from 'react';
import { Work_Sans } from 'next/font/google';
import { actividadesApi, seguimientoActividadApi } from '@/lib/api';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

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
  const [costoAproximado, setCostoAproximado] = useState("");
  const [avanceFisicoInput, setAvanceFisicoInput] = useState("");
  
  // Estados de datos
  const [costoAcumulado, setCostoAcumulado] = useState("0");
  const [avanceFisicoAcumulado, setAvanceFisicoAcumulado] = useState(0);
  
  // Estados de control
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Cargar datos cuando cambia actividadData
  useEffect(() => {
    if (actividadData) {
      setCostoAcumulado(actividadData.costoAcumulado.toLocaleString('es-CO'));
      setAvanceFisicoAcumulado(actividadData.avanceFisicoAcumulado);
      setDescripcion(actividadData.descripcionAnterior || "");
      setActividadesProyectadas(actividadData.actividadesProyectadasAnteriores || "");
      setError(null);
    }
  }, [actividadData]);

  // Cargar datos de la API real
  useEffect(() => {
    if (actividadId && !actividadData) {
      fetchActividadData(actividadId);
    }
  }, [actividadId, actividadData]);

  // Obtener datos reales de actividad y seguimiento
  const fetchActividadData = async (id: string) => {
    try {
      setIsLoadingData(true);
      setError(null);
      
      // Obtener datos de la actividad
      const actividad = await actividadesApi.getById(parseInt(id));
      
      try {
        // Intentar obtener seguimientos existentes para esta actividad
        const seguimientos = await seguimientoActividadApi.getByActividad(parseInt(id));
        
        if (seguimientos && seguimientos.length > 0) {
          // Usar el seguimiento más reciente
          const ultimoSeguimiento = seguimientos[seguimientos.length - 1];
          
          setCostoAcumulado(ultimoSeguimiento.costoAproximado.toLocaleString('es-CO'));
          setAvanceFisicoAcumulado(ultimoSeguimiento.avanceFisico);
          setDescripcion(ultimoSeguimiento.descripcionSeguimiento || "");
          setActividadesProyectadas(ultimoSeguimiento.proyeccionActividades || "");
        } else {
          // No hay seguimientos previos, usar valores por defecto
          setCostoAcumulado("0");
          setAvanceFisicoAcumulado(0);
          setDescripcion("");
          setActividadesProyectadas("");
        }
      } catch (seguimientoError) {
        console.log("No se encontraron seguimientos previos para esta actividad");
        // Valores por defecto si no hay seguimientos
        setCostoAcumulado("0");
        setAvanceFisicoAcumulado(0);
        setDescripcion("");
        setActividadesProyectadas("");
      }
      
    } catch (err) {
      setError("Error al cargar los datos de la actividad");
      console.error("Error fetching actividad data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!actividadId) {
        throw new Error("ID de actividad requerido");
      }

      // Validaciones
      if (!costoAproximado || parseFloat(costoAproximado) < 0) {
        throw new Error("El costo aproximado debe ser un número válido mayor o igual a 0");
      }

      if (!avanceFisicoInput || parseFloat(avanceFisicoInput) < 0) {
        throw new Error("El avance físico debe ser un número válido mayor o igual a 0");
      }

      if (!descripcion.trim()) {
        throw new Error("La descripción del seguimiento es requerida");
      }

      if (!actividadesProyectadas.trim()) {
        throw new Error("Las actividades proyectadas son requeridas");
      }

      // Preparar datos para enviar (el backend genera fechaRegistro automáticamente)
      const seguimientoData = {
        actividadId: parseInt(actividadId),
        avanceFisico: parseFloat(avanceFisicoInput),
        costoAproximado: parseFloat(costoAproximado),
        descripcionSeguimiento: descripcion.trim(),
        proyeccionActividades: actividadesProyectadas.trim()
      };

      // Crear nuevo seguimiento
      await seguimientoActividadApi.create(seguimientoData);

      // Actualizar los valores acumulados localmente
      setCostoAcumulado(parseFloat(costoAproximado).toLocaleString('es-CO'));
      setAvanceFisicoAcumulado(parseFloat(avanceFisicoInput));

      // Limpiar formulario
      setCostoAproximado("");
      setAvanceFisicoInput("");
      
      if (onSubmit) {
        await onSubmit({
          actividadId,
          costoAcumulado: costoAproximado,
          avanceFisico: parseFloat(avanceFisicoInput),
          descripcion,
          actividadesProyectadas
        });
      }
      
      alert("Seguimiento guardado exitosamente");
    } catch (err: any) {
      const errorMessage = err.message || "Error al guardar el seguimiento";
      setError(errorMessage);
      console.error("Error submitting data:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading || isLoadingData) {
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
                 value={costoAproximado}
                 onChange={(e) => setCostoAproximado(e.target.value)}
                 placeholder="0"
                 min="0"
                 step="0.01"
                 required
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
              {avanceFisicoAcumulado}m
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
                 value={avanceFisicoInput}
                 onChange={(e) => setAvanceFisicoInput(e.target.value)}
                 placeholder="0"
                 min="0"
                 step="0.01"
                 required
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
               ← Volver a Frentes de Obra
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