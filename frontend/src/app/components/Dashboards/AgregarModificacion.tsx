"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';
import { modificacionesApi, contratosApi } from '@/lib/api';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface AgregarModificacionPageProps {
  contratoId?: string | null;
  onBackToHome?: () => void;
  onModificacionCreated?: () => void;
}

export default function AgregarModificacionPage({ contratoId, onBackToHome, onModificacionCreated }: AgregarModificacionPageProps) {
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contrato, setContrato] = useState<any>(null);

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
  const [formData, setFormData] = useState({
    tipo: '',
    fechaInicio: '',
    fechaFinal: '',
    observaciones: ''
  });

  // Calcular duración en días
  const calculateDuration = () => {
    if (formData.fechaInicio && formData.fechaFinal) {
      const inicio = new Date(formData.fechaInicio);
      const final = new Date(formData.fechaFinal);
      const diffTime = final.getTime() - inicio.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  // Cargar datos del contrato si existe contratoId
  useEffect(() => {
    const loadContrato = async () => {
      if (contratoId) {
        try {
          const contratoData = await contratosApi.getContrato(parseInt(contratoId));
          setContrato(contratoData);
        } catch (error) {
          console.error('Error al cargar contrato:', error);
        }
      }
    };

    loadContrato();
  }, [contratoId]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else if (contratoId) {
      // Regresar al contrato específico
      router.push(`/contratos?id=${contratoId}`);
    } else {
      // Intentar obtener el último contrato visitado o ir a home
      const lastContractId = localStorage.getItem('lastContractId');
      if (lastContractId) {
        router.push(`/contratos?id=${lastContractId}`);
      } else {
        router.push('/home');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.tipo || !formData.fechaInicio || !formData.fechaFinal) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar que la fecha final sea posterior a la inicial
    if (new Date(formData.fechaFinal) <= new Date(formData.fechaInicio)) {
      alert('La fecha final debe ser posterior a la fecha de inicio');
      return;
    }

    if (!contratoId) {
      alert('Error: No se ha especificado el contrato');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar (el backend calcula la duración automáticamente)
      const modificacionData = {
        contratoId: parseInt(contratoId),
        tipo: formData.tipo,
        fechaInicio: formData.fechaInicio,
        fechaFinal: formData.fechaFinal,
        observaciones: formData.observaciones || ''
      };

      console.log('Enviando modificación:', modificacionData);

      // Crear modificación usando la API real
      await modificacionesApi.create(modificacionData);

      // Mostrar confirmación
      alert('Modificación guardada exitosamente');
      
      // Limpiar formulario
      setFormData({
        tipo: '',
        fechaInicio: '',
        fechaFinal: '',
        observaciones: ''
      });

      // Notificar al componente padre si hay callback
      if (onModificacionCreated) {
        onModificacionCreated();
      }

      // Regresar al contrato
      handleBackToHome();

    } catch (error: any) {
      console.error('Error al guardar modificación:', error);
      alert(`Error al guardar la modificación: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 relative overflow-hidden">
      {/* Fondo con patrón */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="flex flex-col space-y-4 transform -rotate-0 translate-x-[-5%] translate-y-[0%] scale-[2]">
          {Array.from({ length: 12 }).map((_, rowIndex) => (
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

      <header className="bg-blue-900 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToHome}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Regresar</span>
            </button>
            
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
              Bienvenido, {usuario?.USU_NOMBRE || 'Usuario'}
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

      <main className="px-8 py-8 relative z-10">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-6xl mx-auto">
          <h2 
            className={`${workSans.className} text-gray-800 text-center mb-4 align-middle`}
            style={{
              fontWeight: 700,
              fontSize: '48.83px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            Agregar Modificación
          </h2>

          {/* Mostrar información del contrato si está disponible */}
          {contrato && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Información del Contrato</h3>
              <p className="text-blue-700">
                <strong>Número:</strong> {contrato.numeroContrato} | 
                <strong> Contratista:</strong> {contrato.contratista} | 
                <strong> Objeto:</strong> {contrato.objeto}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* LAYOUT HORIZONTAL ALARGADO: Tipo | Fechas | Duración */}
            <div className="flex items-center space-x-8 bg-gray-50 p-6 rounded-lg">
              
              {/* COLUMNA 1: Tipo de modificación */}
              <div className="flex-1">
                <label className={`${workSans.className} block text-gray-700 mb-3`} style={{ fontWeight: 600, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span className="text-red-600 text-xl font-bold">*</span> Tipo de modificación
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-lg font-medium"
                >
                  <option value="">Seleccionar</option>
                  <option value="MODIFICACION">MODIFICACION</option>
                  <option value="PRORROGA">PRORROGA</option>
                  <option value="SUSPENSION">SUSPENSION</option>
                </select>
              </div>

              {/* DIVISOR 1 */}
              <div className="w-px h-32 bg-gray-400"></div>

              {/* COLUMNA 2: Fechas apiladas */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className={`${workSans.className} block text-gray-700 mb-2`} style={{ fontWeight: 600, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
                    <span className="text-red-600 text-xl font-bold">*</span> Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg font-medium"
                  />
                </div>
                
                <div>
                  <label className={`${workSans.className} block text-gray-700 mb-2`} style={{ fontWeight: 600, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
                    <span className="text-red-600 text-xl font-bold">*</span> Fecha Final
                  </label>
                  <input
                    type="date"
                    name="fechaFinal"
                    value={formData.fechaFinal}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg font-medium"
                  />
                </div>
              </div>

              {/* DIVISOR 2 */}
              <div className="w-px h-32 bg-gray-400"></div>

              {/* COLUMNA 3: Duración */}
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-8 text-center w-full h-32 flex flex-col justify-center">
                  <div className="text-purple-700 font-bold text-xl mb-2">Duración</div>
                  <div className="text-purple-600 font-bold text-3xl">
                    {calculateDuration()} días
                  </div>
                </div>
              </div>

            </div>

            {/* Observaciones */}
            <div>
              <label className={`${workSans.className} block text-gray-700 mb-3 text-left`} style={{ fontWeight: 600, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', verticalAlign: 'middle' }}>
                Observaciones:
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={8}
                placeholder="Escriba las observaciones aquí..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 text-lg font-medium placeholder-gray-500"
              ></textarea>
            </div>

            {/* Botón enviar */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors font-medium flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Enviar</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 