"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logoMedellin from '@/assets/logo-medellin.png';

// Datos del sistema SSC
const sscData = {
  "contratos": [
    {
      "CON_ID": 1,
      "CON_USU_CEDULA": 12345678,
      "CON_NRO_CONTRATO": 460010403,
      "CON_ANO_SUSCRIPCION": 2025,
      "CON_PROGRAMA": "Infraestructura Verde",
      "CON_TIPO_CONTRATO": "INTERVENTORÍA",
      "CON_OBJETO": "CONTRATO INTERADMINISTRATIVO DE MANDATO SIN REPRESENTACIÓN PARA LA DISPOSICIÓN, MANTENIMIENTO Y CONSERVACIÓN DE LA INFRAESTRUCTURA VERDE EXISTENTE",
      "CON_IDENTIFICADOR_SIMPLE": "#460010403",
      "CON_SUPERVISOR_TECNICO": "TERMINALES DE TRANSPORTE MEDELLÍN S.A.",
      "CON_SUPLENTES": "Juan Pérez, Laura Gómez",
      "CON_APOYO": "Equipo Técnico Municipal",
      "CON_ESTADO": "ACTIVO",
      "CON_CONTRATISTA": "TERMINALES DE TRANSPORTE MEDELLÍN S.A.",
      "CON_NRO_PROCESO": "CV-2025-001",
      "CON_FECHA_INI": "2025-01-01",
      "CON_FECHA_TER_INI": "2025-09-01",
      "CON_FECHA_TER_ACT": "2025-10-15",
      "CON_VALOR_INI": 1645728320,
      "CON_VALOR_TOTAL": 1745728320
    },
    {
      "CON_ID": 2,
      "CON_USU_CEDULA": 87654321,
      "CON_NRO_CONTRATO": 460010404,
      "CON_ANO_SUSCRIPCION": 2025,
      "CON_PROGRAMA": "Movilidad Sostenible",
      "CON_TIPO_CONTRATO": "OBRA PÚBLICA",
      "CON_OBJETO": "CONSTRUCCIÓN Y ADECUACIÓN DE CICLORRUTAS EN LA COMUNA 10 DE MEDELLÍN",
      "CON_IDENTIFICADOR_SIMPLE": "#460010404",
      "CON_SUPERVISOR_TECNICO": "EMPRESA DE DESARROLLO URBANO",
      "CON_SUPLENTES": "Pedro López, Sandra Cruz",
      "CON_APOYO": "Secretaría de Movilidad",
      "CON_ESTADO": "ACTIVO",
      "CON_CONTRATISTA": "CONSTRUCTORA VÍAS S.A.S.",
      "CON_NRO_PROCESO": "CV-2025-002",
      "CON_FECHA_INI": "2025-02-01",
      "CON_FECHA_TER_INI": "2025-08-01",
      "CON_FECHA_TER_ACT": "2025-08-01",
      "CON_VALOR_INI": 2500000000,
      "CON_VALOR_TOTAL": 2500000000
    }
  ],
  "adiciones": [
    {
      "ADI_ID": 1,
      "ADI_CON_ID": 1,
      "ADI_VALOR_ADICION": 100000000,
      "ADI_FECHA": "2025-01-15",
      "ADI_CREATED_AT": "2025-01-15T11:20:00Z",
      "ADI_OBSERVACIONES": "Adición para ampliación del alcance del proyecto incluyendo zona centro de la ciudad."
    }
  ],
  "modificaciones": [
    {
      "MOD_ID": 1,
      "MOD_CON_ID": 1,
      "MOD_TIPO": "PLAZO",
      "MOD_FECHA_INICIO": "2025-09-01",
      "MOD_FECHA_FINAL": "2025-10-15",
      "MOD_DURACION": 44,
      "MOD_CREATED_AT": "2025-01-10T09:15:00Z",
      "MOD_OBSERVACIONES": "Prórroga solicitada por el contratista debido a condiciones climáticas adversas."
    },
    {
      "MOD_ID": 2,
      "MOD_CON_ID": 2,
      "MOD_TIPO": "ALCANCE",
      "MOD_FECHA_INICIO": "2025-02-01",
      "MOD_FECHA_FINAL": "2025-08-01",
      "MOD_DURACION": 0,
      "MOD_CREATED_AT": "2024-12-20T13:45:00Z",
      "MOD_OBSERVACIONES": "Modificación del alcance para incluir señalización vertical y horizontal adicional."
    }
  ],
  "seguimiento_general": [
    {
      "SEG_ID": 1,
      "SEG_CON_ID": 1,
      "SEG_AVANCE_FINANCIERO": 45,
      "SEG_AVANCE_FISICO": 42,
      "SEG_CREATED_AT": "2025-01-20T14:30:00Z",
      "SEG_OBSERVACIONES": "El proyecto avanza según cronograma. Se han completado las actividades de diagnóstico y diseño preliminar."
    },
    {
      "SEG_ID": 2,
      "SEG_CON_ID": 2,
      "SEG_AVANCE_FINANCIERO": 25,
      "SEG_AVANCE_FISICO": 30,
      "SEG_CREATED_AT": "2025-01-18T16:45:00Z",
      "SEG_OBSERVACIONES": "Iniciadas las obras de ciclorrutas en el sector A. Se presenta leve retraso por lluvias."
    }
  ]
};

// Interfaces
interface Usuario {
  USU_CEDULA: number;
  USU_EMAIL: string;
  USU_ROL: string;
  USU_NOMBRE: string;
}

interface Contrato {
  CON_ID: number;
  CON_USU_CEDULA: number;
  CON_NRO_CONTRATO: number;
  CON_ANO_SUSCRIPCION: number;
  CON_PROGRAMA: string;
  CON_TIPO_CONTRATO: string;
  CON_OBJETO: string;
  CON_IDENTIFICADOR_SIMPLE: string;
  CON_SUPERVISOR_TECNICO: string;
  CON_SUPLENTES: string;
  CON_APOYO: string;
  CON_ESTADO: string;
  CON_CONTRATISTA: string;
  CON_NRO_PROCESO: string;
  CON_FECHA_INI: string;
  CON_FECHA_TER_INI: string;
  CON_FECHA_TER_ACT: string;
  CON_VALOR_INI: number;
  CON_VALOR_TOTAL: number;
}

interface ContratosPageProps {
  onBackToHome?: () => void;
}

export default function ContratosPage({ onBackToHome }: ContratosPageProps = {}) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [adiciones, setAdiciones] = useState<{ADI_ID: number; ADI_CON_ID: number; ADI_VALOR_ADICION: number; ADI_FECHA: string; ADI_OBSERVACIONES: string}[]>([]);
  const [modificaciones, setModificaciones] = useState<{MOD_ID: number; MOD_CON_ID: number; MOD_TIPO: string; MOD_DURACION: number; MOD_OBSERVACIONES: string}[]>([]);
  const [seguimiento, setSeguimiento] = useState<{SEG_ID: number; SEG_CON_ID: number; SEG_AVANCE_FINANCIERO: number; SEG_AVANCE_FISICO: number; SEG_OBSERVACIONES: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const contratoId = searchParams.get('id');

  // Cargar datos del contrato
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      const userInfo = JSON.parse(userData);
      setUsuario(userInfo);
      
      if (!contratoId) {
        router.push('/home');
        return;
      }
      setTimeout(() => {
        const contratoEncontrado = sscData.contratos.find(c => c.CON_ID.toString() === contratoId);
        
        if (!contratoEncontrado) {
          router.push('/home');
          return;
        }

        const adicionesContrato = sscData.adiciones.filter(a => a.ADI_CON_ID.toString() === contratoId);
        const modificacionesContrato = sscData.modificaciones.filter(m => m.MOD_CON_ID.toString() === contratoId);
        const seguimientoContrato = sscData.seguimiento_general.find(s => s.SEG_CON_ID.toString() === contratoId);

        setContrato(contratoEncontrado);
        setAdiciones(adicionesContrato);
        setModificaciones(modificacionesContrato);
        setSeguimiento(seguimientoContrato || null);
        setLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      router.push('/');
    }
  }, [router, contratoId]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      router.push('/home');
    }
  };

  const formatearValor = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularCostoEjecutado = () => {
    if (!contrato || !seguimiento) return 0;
    return Math.round((contrato.CON_VALOR_TOTAL * seguimiento.SEG_AVANCE_FINANCIERO) / 100);
  };

  if (loading || !usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{loading ? 'Cargando contrato...' : 'Verificando autenticación...'}</p>
        </div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Contrato no encontrado</h2>
          <button 
            onClick={handleBackToHome}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Regresar al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 relative overflow-hidden">
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

      <header className="bg-blue-800 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToHome}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Regresar</span>
            </button>
            
            <div className="bg-white rounded-lg p-3 shadow-lg">
              <Image
                src={logoMedellin}
                alt="Alcaldía de Medellín"
                width={56}
                height={70}
                className="w-14 h-[4.5rem] object-contain"
              />
            </div>
            
            <div className="w-px h-12 bg-white opacity-50"></div>
            
            <div className="text-white">
              <h1 className="text-5xl font-bold">SIF</h1>
              <p className="text-sm text-blue-200">Alcaldía de Medellín</p>
              <p className="text-xs text-blue-300">Ciencia, Tecnología e Innovación</p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="text-white text-right">
              <p className="text-base font-medium">{usuario.USU_NOMBRE}</p>
              <p className="text-sm text-blue-200 capitalize">{usuario.USU_ROL}</p>
            </div>
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
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Header del contrato */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                {contrato.CON_IDENTIFICADOR_SIMPLE}
              </h2>
              <p className="text-gray-600">Contrato No. {contrato.CON_NRO_CONTRATO} - {contrato.CON_ANO_SUSCRIPCION}</p>
            </div>
            <div className="bg-purple-500 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Tipo:</span>
              <br />
              <span className="font-bold">{contrato.CON_TIPO_CONTRATO}</span>
            </div>
          </div>

          {/* Información principal del contrato */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Objeto:</h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {contrato.CON_OBJETO}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Contratista:</h3>
                <p className="text-gray-800 font-medium">
                  {contrato.CON_CONTRATISTA}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Supervisor Técnico:</h3>
                  <p className="text-sm text-gray-700">{contrato.CON_SUPERVISOR_TECNICO}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Estado:</h3>
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {contrato.CON_ESTADO}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Valor Inicial:</h3>
                <p className="text-lg font-bold text-gray-800">{formatearValor(contrato.CON_VALOR_INI)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Valor Total:</h3>
                <p className="text-xl font-bold text-green-600">{formatearValor(contrato.CON_VALOR_TOTAL)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Fecha de Finalización:</h3>
                <p className="text-lg font-medium text-gray-800">{formatearFecha(contrato.CON_FECHA_TER_ACT)}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-300 mb-8" />

          {/* Secciones de Adiciones y Modificaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Adiciones */}
            <div>
              <h3 className="text-xl font-bold text-cyan-600 mb-4">Adiciones</h3>
              
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cyan-500 text-white">
                      <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adiciones.length > 0 ? (
                      adiciones.map((adicion, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm">{formatearFecha(adicion.ADI_FECHA)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            {formatearValor(adicion.ADI_VALOR_ADICION)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          No hay adiciones registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => router.push(`/agregar-adicion?contrato=${contrato.CON_ID}`)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  + Agregar Adición
                </button>
              </div>
            </div>

            {/* Modificaciones */}
            <div>
              <h3 className="text-xl font-bold text-blue-600 mb-4">Modificaciones</h3>
              
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modificaciones.length > 0 ? (
                      modificaciones.map((modificacion, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm font-medium">{modificacion.MOD_TIPO}</td>
                          <td className="px-4 py-3 text-sm">{modificacion.MOD_DURACION} días</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          No hay modificaciones registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => router.push(`/agregar-modificacion?contrato=${contrato.CON_ID}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  + Agregar Modificación
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas del proyecto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <h4 className="text-sm text-gray-600 mb-2">Costo total de obra ejecutada:</h4>
              <p className="text-4xl font-bold text-green-600">
                {seguimiento ? formatearValor(calcularCostoEjecutado()) : formatearValor(0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Basado en {seguimiento ? `${seguimiento.SEG_AVANCE_FINANCIERO}%` : '0%'} de avance financiero
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-sm text-gray-600 mb-2">Total de obra ejecutada:</h4>
              <p className="text-4xl font-bold text-orange-500">
                {seguimiento ? `${seguimiento.SEG_AVANCE_FISICO}%` : '0%'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Avance físico del proyecto</p>
            </div>
          </div>

          {/* Avance del proyecto */}
          {seguimiento && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Último Seguimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Avance Financiero</label>
                  <div className="mt-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all"
                      style={{ width: `${seguimiento.SEG_AVANCE_FINANCIERO}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{seguimiento.SEG_AVANCE_FINANCIERO}%</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Avance Físico</label>
                  <div className="mt-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-orange-500 h-4 rounded-full transition-all"
                      style={{ width: `${seguimiento.SEG_AVANCE_FISICO}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{seguimiento.SEG_AVANCE_FISICO}%</p>
                </div>
              </div>
              
              {seguimiento.SEG_OBSERVACIONES && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Observaciones:</h4>
                  <p className="text-gray-600 text-sm bg-white p-3 rounded border-l-4 border-blue-400">
                    {seguimiento.SEG_OBSERVACIONES}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Botones de seguimiento */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push(`/seguimiento-general?contrato=${contrato.CON_ID}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Realizar Seguimiento General</span>
            </button>
            
            <button 
              onClick={() => router.push(`/seguimiento-actividades?contrato=${contrato.CON_ID}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Realizar Seguimiento Por Actividad</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 