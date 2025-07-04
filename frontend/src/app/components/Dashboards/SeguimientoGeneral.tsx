"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';
import { seguimientoGeneralApi, contratosApi } from '@/lib/api';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface Usuario {
  USU_CEDULA: number;
  USU_EMAIL: string;
  USU_ROL: string;
  USU_NOMBRE: string;
}

interface SeguimientoGeneralPageProps {
  contratoId?: string | null;
  onBackToHome?: () => void;
}

export default function SeguimientoGeneralPage({ contratoId, onBackToHome }: SeguimientoGeneralPageProps) {
  // Estados
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [contrato, setContrato] = useState<{ valorTotal?: number; numeroContrato?: string; contratista?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    avanceFinanciero: 0,
    avanceFisico: 0,
    observaciones: ''
  });

  const router = useRouter();

  // Cargar datos del contrato y seguimiento existente
  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/');
        return;
      }

      if (!contratoId) {
        router.push('/home');
        return;
      }

      try {
        const userInfo = JSON.parse(userData);
        setUsuario(userInfo);

        // Cargar datos del contrato
        const contratoData = await contratosApi.getContrato(parseInt(contratoId));
        setContrato(contratoData);

        // Intentar cargar seguimiento existente
        try {
          const seguimientoData = await seguimientoGeneralApi.getByContrato(parseInt(contratoId));
          if (seguimientoData && seguimientoData.length > 0) {
            const ultimoSeguimiento = seguimientoData[seguimientoData.length - 1];
            
            setFormData({
              avanceFinanciero: ultimoSeguimiento.avanceFinanciero || 0,
              avanceFisico: ultimoSeguimiento.avanceFisico || 0,
              observaciones: ultimoSeguimiento.observaciones || ''
            });
          }
        } catch {
          console.log('No hay seguimiento previo - iniciando con valores en 0');
          // No hay seguimiento previo, mantener valores iniciales en 0
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
        router.push('/home');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, contratoId]);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else if (contratoId) {
      router.push(`/contratos?id=${contratoId}`);
    } else {
      router.push('/home');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'observaciones' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contratoId || !formData.avanceFinanciero || !formData.avanceFisico) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setSubmitting(true);
    
    try {
      const seguimientoData = {
        contratoId: parseInt(contratoId),
        avanceFinanciero: formData.avanceFinanciero,
        avanceFisico: formData.avanceFisico,
        observaciones: formData.observaciones || ''
      };

      console.log('Enviando seguimiento:', seguimientoData);

      await seguimientoGeneralApi.create(seguimientoData);
      
      alert('Seguimiento general guardado exitosamente');
      handleBackToHome();
    } catch (error: any) {
      console.error('Error guardando seguimiento:', error);
      alert(`Error al guardar el seguimiento: ${error.message || 'Intente nuevamente'}`);
    } finally {
      setSubmitting(false);
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
      <div className="absolute inset-0 opacity-5 pointer-events-none">
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

              <header className="bg-blue-900 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToHome}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-200"
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
            <div className="text-white text-right">
              <p className="text-base font-medium">{usuario?.USU_NOMBRE || 'Usuario'}</p>
              <p className="text-sm text-blue-200 capitalize">{usuario?.USU_ROL || 'Cargando...'}</p>
            </div>
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

      <main className="px-8 py-8 relative z-10">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
          {/* Información del contrato */}
          {contrato && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Contrato:</h3>
              <div className="text-base text-blue-700">
                <p><strong>Número:</strong> #{contrato.numeroContrato}</p>
                <p><strong>Contratista:</strong> {contrato.contratista}</p>
                <p><strong>Valor Total:</strong> ${contrato.valorTotal?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
          )}

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
            Seguimiento General
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos del contrato...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Avance Financiero */}
              <div className="text-center">
                <div className="mb-4">
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
                    Total de
                    <br />
                    Avance Financiero:
                  </h3>
                  <p className="text-4xl font-bold text-green-600 mb-4">
                    ${formData.avanceFinanciero.toLocaleString()}
                  </p>
                </div>
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
                    Valor Financiero <span className="text-red-600 text-xl font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="avanceFinanciero"
                    value={formData.avanceFinanciero}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                </div>
              </div>

              {/* Avance Físico */}
              <div className="text-center">
                <div className="mb-4">
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
                    Total de
                    <br />
                    Avance Físico:
                  </h3>
                  <p className="text-4xl font-bold text-orange-600 mb-4">
                    {formData.avanceFisico}%
                  </p>
                </div>
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
                    % de Avance Físico <span className="text-red-600 text-xl font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="avanceFisico"
                    value={formData.avanceFisico}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones:
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={8}
                placeholder="Ingrese las observaciones del seguimiento..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            {/* Botón enviar */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-full transition-colors font-medium flex items-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  'Enviar Seguimiento'
                )}
              </button>
            </div>
          </form>
          )}
        </div>
      </main>
    </div>
  );
} 