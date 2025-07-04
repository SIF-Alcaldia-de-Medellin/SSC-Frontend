"use client";

import { useState, useEffect } from 'react';
import { Work_Sans } from 'next/font/google';
import SeguimientoAvance from './SeguimientoAvance';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

// Datos del sistema SSC
// Datos hardcodeados eliminados - ahora se debe usar la API real

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

interface CreateActividadForm {
  actividad: string;
  metaFisica: number;
  proyectadoFinanciero: number;
  unidadesAvance: string;
}

export default function ActividadesPage({ cuoId }: ActividadesPageProps) {
  // Estados
  const [selectedActivity, setSelectedActivity] = useState<Actividad | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingActividad, setCreatingActividad] = useState(false);

  const [formData, setFormData] = useState<CreateActividadForm>({
    actividad: '',
    metaFisica: 0,
    proyectadoFinanciero: 0,
    unidadesAvance: 'Metros cuadrados'
  });

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUsuario(JSON.parse(userData));
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    }
  }, []);

  // Cargar actividades del CUO desde la API real
  useEffect(() => {
    if (!cuoId) return;

    const loadActividades = async () => {
      setIsLoading(true);
      try {
        // Importar la API dinámicamente para evitar problemas de SSR
        const { actividadesApi } = await import('@/lib/api');
        const actividadesData = await actividadesApi.getActividadesByCuo(parseInt(cuoId));
        
        // Mapear datos de la API al formato del frontend (usando el formato real del backend)
        const actividadesFormateadas = actividadesData.map((actividad: any) => ({
          ACT_ID: actividad.id,
          ACT_CUO_ID: actividad.cuoId,
          ACT_ACTIVIDAD: actividad.actividad,
          ACT_METAFISICA: actividad.metaFisica,
          ACT_PROYECTADO_FINANCIERO: parseInt(actividad.proyectadoFinanciero) || 0,
          ACT_UNIDADES_AVANCE: actividad.unidadesAvance
        }));
        
        setActividades(actividadesFormateadas);
      } catch (error) {
        console.error('Error cargando actividades reales:', error);
        setActividades([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadActividades();
  }, [cuoId]);

  // Handlers para el modal de crear actividad
  const handleCreateActividad = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      actividad: '',
      metaFisica: 0,
      proyectadoFinanciero: 0,
      unidadesAvance: 'Metros cuadrados'
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingActividad(true);

    try {
      // Validaciones
      if (!formData.actividad || formData.metaFisica <= 0 || formData.proyectadoFinanciero <= 0) {
        alert('Por favor complete todos los campos con valores válidos');
        return;
      }

      // Preparar datos usando la estructura exacta que especificaste
      const actividadData = {
        cuoId: parseInt(cuoId),
        actividad: formData.actividad,
        metaFisica: formData.metaFisica,
        proyectadoFinanciero: formData.proyectadoFinanciero,
        unidadesAvance: formData.unidadesAvance
      };

      console.log('Enviando datos de actividad con estructura correcta:', actividadData);
      
      // Llamar a la API
      const { actividadesApi } = await import('@/lib/api');
      await actividadesApi.create(actividadData);
      
      alert('¡Actividad creada exitosamente!');
      
      // Cerrar modal
      handleCloseModal();
      
      // Recargar actividades
      try {
        const actividadesData = await actividadesApi.getActividadesByCuo(parseInt(cuoId));
        const actividadesFormateadas = actividadesData.map((actividad: any) => ({
          ACT_ID: actividad.id,
          ACT_CUO_ID: actividad.cuoId,
          ACT_ACTIVIDAD: actividad.actividad,
          ACT_METAFISICA: actividad.metaFisica,
          ACT_PROYECTADO_FINANCIERO: parseInt(actividad.proyectadoFinanciero) || 0,
          ACT_UNIDADES_AVANCE: actividad.unidadesAvance
        }));
        setActividades(actividadesFormateadas);
      } catch (error) {
        console.error('Error recargando actividades:', error);
      }
      
    } catch (error: any) {
      console.error('Error creando actividad:', error);
      alert(`Error al crear la actividad: ${error.message || 'Error desconocido'}`);
    } finally {
      setCreatingActividad(false);
    }
  };

  // Formatear valores
  const formatearValor = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Determinar si es administrador
  const esAdministrador = usuario?.USU_ROL?.toLowerCase() === 'admin';

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {!selectedActivity ? (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 
              className={`${workSans.className} text-gray-800 align-middle`}
              style={{
                fontWeight: 700,
                fontSize: '48.83px',
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle'
              }}
            >
              ¿Qué <span className="text-fuchsia-600">actividad</span> deseas seguir?
            </h2>
            
            {/* Botón crear actividad solo para administradores */}
            {esAdministrador && (
              <button
                onClick={handleCreateActividad}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg"
              >
                <span className="text-xl">+</span>
                <span>Crear Nueva Actividad</span>
              </button>
            )}
          </div>

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

      {/* Modal para crear actividad */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 
                    className={`${workSans.className}`}
                    style={{
                      fontWeight: 700,
                      fontSize: '28px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}
                  >
                    Nueva Actividad
                  </h2>
                  <p className="text-fuchsia-100 mt-2">Complete los detalles de la actividad para el CUO {cuoId}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-fuchsia-100 hover:text-white text-2xl font-bold p-2 hover:bg-fuchsia-800 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8">
              {/* Información principal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Columna izquierda - Datos básicos */}
                <div className="space-y-6">
                  <div>
                    <h3 className={`${workSans.className} text-xl font-semibold text-gray-800 mb-6`}>
                      Información Básica
                    </h3>
                    
                    {/* Nombre de la actividad */}
                    <div className="mb-6">
                      <label 
                        className={`${workSans.className} block text-gray-700 mb-3 font-medium`}
                      >
                        <span className="text-red-500">*</span> Nombre de la Actividad
                      </label>
                      <input
                        type="text"
                        value={formData.actividad}
                        onChange={(e) => setFormData({...formData, actividad: e.target.value})}
                        placeholder="Construcción de andenes en concreto hidráulico"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    {/* Meta física */}
                    <div className="mb-6">
                      <label 
                        className={`${workSans.className} block text-gray-700 mb-3 font-medium`}
                      >
                        <span className="text-red-500">*</span> Meta Física
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.metaFisica}
                        onChange={(e) => setFormData({...formData, metaFisica: parseFloat(e.target.value) || 0})}
                        min="0.1"
                        placeholder="150.5"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-gray-900"
                      />
                      <p className="text-gray-500 text-sm mt-2">Cantidad de trabajo a realizar (acepta decimales)</p>
                    </div>
                  </div>
                </div>

                {/* Columna derecha - Datos técnicos */}
                <div className="space-y-6">
                  <div>
                    <h3 className={`${workSans.className} text-xl font-semibold text-gray-800 mb-6`}>
                      Especificaciones Técnicas
                    </h3>
                    
                    {/* Unidades de avance */}
                    <div className="mb-6">
                      <label 
                        className={`${workSans.className} block text-gray-700 mb-3 font-medium`}
                      >
                        <span className="text-red-500">*</span> Unidades de Medida
                      </label>
                      <select
                        value={formData.unidadesAvance}
                        onChange={(e) => setFormData({...formData, unidadesAvance: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-gray-900"
                      >
                        <option value="Metros cuadrados">Metros cuadrados</option>
                        <option value="Metros lineales">Metros lineales</option>
                        <option value="Metros cúbicos">Metros cúbicos</option>
                        <option value="Unidades">Unidades</option>
                        <option value="Toneladas">Toneladas</option>
                        <option value="Kilogramos">Kilogramos</option>
                        <option value="Global">Global</option>
                      </select>
                    </div>

                    {/* Proyectado financiero */}
                    <div className="mb-6">
                      <label 
                        className={`${workSans.className} block text-gray-700 mb-3 font-medium`}
                      >
                        <span className="text-red-500">*</span> Presupuesto Asignado
                      </label>
                      <input
                        type="number"
                        value={formData.proyectadoFinanciero}
                        onChange={(e) => setFormData({...formData, proyectadoFinanciero: parseInt(e.target.value) || 0})}
                        min="1"
                        placeholder="75000000"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-gray-900"
                      />
                      <p className="text-gray-500 text-sm mt-2">Valor proyectado en pesos colombianos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen de la actividad */}
              <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                <h3 className={`${workSans.className} text-lg font-semibold text-gray-800 mb-4`}>
                  Resumen de la Actividad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Actividad</p>
                    <p className="text-gray-800 font-semibold mt-1">
                      {formData.actividad || 'Sin definir'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Cantidad</p>
                    <p className="text-gray-800 font-semibold mt-1">
                      {formData.metaFisica || 0} {formData.unidadesAvance}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Presupuesto</p>
                    <p className="text-gray-800 font-semibold mt-1">
                      ${formData.proyectadoFinanciero ? formData.proyectadoFinanciero.toLocaleString('es-CO') : '0'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">CUO Asignado</p>
                    <p className="text-gray-800 font-semibold mt-1">#{cuoId}</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingActividad}
                  className="px-8 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors disabled:bg-fuchsia-400 flex items-center space-x-2 font-medium shadow-lg"
                >
                  {creatingActividad ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creando Actividad...</span>
                    </>
                  ) : (
                    <span>Crear Actividad</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 