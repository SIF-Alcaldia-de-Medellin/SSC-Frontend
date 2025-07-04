"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';
import { contratosApi, seguimientoGeneralApi, adicionesApi, modificacionesApi } from '@/lib/api';
import AgregarAdicionPage from './AgregarAdicion';
import AgregarModificacionPage from './AgregarModificacion';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

// Eliminamos los datos hardcodeados - ahora todo viene de la base de datos real

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
  contratoId?: string | null;
  onBackToHome?: () => void;
}

export default function ContratosPage({ contratoId, onBackToHome }: ContratosPageProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [adiciones, setAdiciones] = useState<{ADI_ID: number; ADI_CON_ID: number; ADI_VALOR_ADICION: number; ADI_FECHA: string; ADI_OBSERVACIONES: string}[]>([]);
  const [modificaciones, setModificaciones] = useState<{MOD_ID: number; MOD_CON_ID: number; MOD_TIPO: string; MOD_DURACION: number; MOD_OBSERVACIONES: string}[]>([]);
  const [seguimiento, setSeguimiento] = useState<{SEG_ID: number; SEG_CON_ID: number; SEG_AVANCE_FINANCIERO: number; SEG_AVANCE_FISICO: number; SEG_OBSERVACIONES: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAgregarAdicion, setShowAgregarAdicion] = useState(false);
  const [showAgregarModificacion, setShowAgregarModificacion] = useState(false);
  
  const router = useRouter();

  // Función para cargar datos del contrato desde la API
  const loadContractData = useCallback(async (contratoId: string) => {
    try {
      setLoading(true);
      
      // Cargar contrato desde la API real (sin datos hardcodeados)
      const contratoData = await contratosApi.getContrato(parseInt(contratoId));
      
      // Mapear directamente los datos del backend a la interfaz del frontend
      const contratoFormateado: Contrato = {
        CON_ID: contratoData.id,
        CON_USU_CEDULA: 0, // Campo opcional no disponible en API
        CON_NRO_CONTRATO: parseInt(contratoData.numeroContrato.toString()),
        CON_ANO_SUSCRIPCION: new Date().getFullYear(), // Campo calculado
        CON_PROGRAMA: contratoData.programa,
        CON_TIPO_CONTRATO: contratoData.tipoContrato,
        CON_OBJETO: contratoData.objeto,
        CON_IDENTIFICADOR_SIMPLE: `#${contratoData.numeroContrato}`,
        CON_SUPERVISOR_TECNICO: "No asignado", // Campo no disponible en API
        CON_SUPLENTES: "No asignado", // Campo no disponible en API
        CON_APOYO: "No asignado", // Campo no disponible en API
        CON_ESTADO: contratoData.estado,
        CON_CONTRATISTA: contratoData.contratista,
        CON_NRO_PROCESO: "N/A", // Campo no disponible en API
        CON_FECHA_INI: contratoData.fechaInicio,
        CON_FECHA_TER_INI: contratoData.fechaTerminacionActual, // Usando el mismo campo
        CON_FECHA_TER_ACT: contratoData.fechaTerminacionActual,
        CON_VALOR_INI: contratoData.valorInicial,
        CON_VALOR_TOTAL: contratoData.valorTotal
      };

      // Cargar datos adicionales en paralelo
      const [adicionesData, modificacionesData, seguimientoData] = await Promise.all([
        adicionesApi.getByContrato(parseInt(contratoId)).catch(() => []),
        modificacionesApi.getByContrato(parseInt(contratoId)).catch(() => []),
        seguimientoGeneralApi.getByContrato(parseInt(contratoId)).catch(() => [])
      ]);

      setContrato(contratoFormateado);
      
      // Transformar adiciones de la API al formato local
      const adicionesFormateadas = adicionesData.map((adicion: unknown) => {
        const a = adicion as Record<string, unknown>;
        return ({
          ADI_ID: Number(a.id),
          ADI_CON_ID: Number(a.contratoId),
          ADI_VALOR_ADICION: Number(a.valorAdicion),
          ADI_FECHA: String(a.fecha),
          ADI_OBSERVACIONES: String(a.observaciones || "")
        });
      });
      
      // Transformar modificaciones de la API al formato local
      const modificacionesFormateadas = modificacionesData.map((modificacion: unknown) => {
        const m = modificacion as Record<string, unknown>;
        return ({
          MOD_ID: Number(m.id),
          MOD_CON_ID: Number(m.contratoId),
          MOD_TIPO: String(m.tipo),
          MOD_DURACION: Number(m.duracion),
          MOD_OBSERVACIONES: String(m.observaciones || "")
        });
      });
      
      setAdiciones(adicionesFormateadas);
      setModificaciones(modificacionesFormateadas);
      
      // Convertir seguimiento del backend al formato frontend
      if (seguimientoData[0]) {
        const seguimientoFormateado = {
          SEG_ID: seguimientoData[0].id,
          SEG_CON_ID: seguimientoData[0].contratoId,
          SEG_AVANCE_FINANCIERO: seguimientoData[0].avanceFinanciero,
          SEG_AVANCE_FISICO: seguimientoData[0].avanceFisico,
          SEG_OBSERVACIONES: seguimientoData[0].observaciones || ""
        };
        setSeguimiento(seguimientoFormateado);
      } else {
        setSeguimiento(null);
      }
      
    } catch (error) {
      console.error('Error cargando datos del contrato desde la base de datos:', error);
      // No hay fallback - si falla la API, redirigir al home
      router.push('/home');
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

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
      loadContractData(contratoId);

    } catch (error) {
      console.error('Error al cargar datos:', error);
      router.push('/');
    }
  }, [router, contratoId, loadContractData]);

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

  // Función para manejar el éxito al agregar adición
  const handleAdicionSuccess = () => {
    if (contratoId) {
      // Recargar los datos del contrato para mostrar la nueva adición
      loadContractData(contratoId);
    }
    setShowAgregarAdicion(false);
  };

  const handleBackFromAdicion = () => {
    setShowAgregarAdicion(false);
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
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
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
              <h2 
                className={`${workSans.className} text-purple-600 mb-2 align-middle`}
                style={{
                  fontWeight: 800,
                  fontSize: '61.04px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle'
                }}
              >
                Contrato {contrato.CON_IDENTIFICADOR_SIMPLE}
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
                <h3 
                  className={`${workSans.className} text-purple-700 mb-2 align-middle`}
                  style={{
                    fontWeight: 700,
                    fontSize: '31.25px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  Objeto:
                </h3>
                <p 
                  className={`${workSans.className} text-gray-800 align-middle`}
                  style={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle'
                  }}
                >
                  {contrato.CON_OBJETO}
                </p>
              </div>
              <div className="mb-4">
                <h3 
                  className={`${workSans.className} text-purple-700 mb-2 align-middle`}
                  style={{
                    fontWeight: 700,
                    fontSize: '31.25px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  Contratista:
                </h3>
                <p 
                  className={`${workSans.className} text-gray-800 align-middle`}
                  style={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle'
                  }}
                >
                  {contrato.CON_CONTRATISTA}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 
                    className={`${workSans.className} text-purple-700 mb-1 align-middle`}
                    style={{
                      fontWeight: 700,
                      fontSize: '31.25px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'left',
                      verticalAlign: 'middle'
                    }}
                  >
                    Supervisor Técnico:
                  </h3>
                  <p 
                    className={`${workSans.className} text-gray-700 align-middle`}
                    style={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      verticalAlign: 'middle'
                    }}
                  >
                    {contrato.CON_SUPERVISOR_TECNICO}
                  </p>
                </div>
                <div>
                                      <h3 
                      className={`${workSans.className} text-purple-700 mb-1 align-middle`}
                      style={{
                        fontWeight: 700,
                        fontSize: '31.25px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        textAlign: 'left',
                        verticalAlign: 'middle'
                      }}
                    >
                      Estado:
                    </h3>
                  <span 
                    className={`${workSans.className} inline-block bg-green-100 text-green-800 px-2 py-1 rounded align-middle`}
                    style={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      verticalAlign: 'middle'
                    }}
                  >
                    {contrato.CON_ESTADO}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 
                  className={`${workSans.className} text-purple-700 mb-1 align-middle`}
                  style={{
                    fontWeight: 700,
                    fontSize: '31.25px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  Valor Inicial:
                </h3>
                <p className="text-lg font-bold text-gray-800">{formatearValor(contrato.CON_VALOR_INI)}</p>
              </div>
              <div>
                <h3 
                  className={`${workSans.className} text-purple-700 mb-1 align-middle`}
                  style={{
                    fontWeight: 700,
                    fontSize: '31.25px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  Valor Total:
                </h3>
                <p className="text-xl font-bold text-gray-800">{formatearValor(contrato.CON_VALOR_TOTAL)}</p>
              </div>
              <div>
                <h3 
                  className={`${workSans.className} text-purple-700 mb-1 align-middle`}
                  style={{
                    fontWeight: 700,
                    fontSize: '31.25px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'left',
                    verticalAlign: 'middle'
                  }}
                >
                  Fecha de Finalización:
                </h3>
                <p 
                  className={`${workSans.className} text-gray-800 align-middle`}
                  style={{
                    fontWeight: 600,
                    fontSize: '31.25px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle'
                  }}
                >
                  {formatearFecha(contrato.CON_FECHA_TER_ACT)}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-300 mb-8" />

          {/* Secciones de Adiciones y Modificaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Adiciones */}
            <div>
              <h3 
                className={`${workSans.className} text-sky-600 mb-4 align-middle`}
                style={{
                  fontWeight: 700,
                  fontSize: '31.25px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                Adiciones
              </h3>
              
              <div className="bg-sky-50 rounded-lg overflow-hidden border border-sky-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sky-600 text-white">
                      <th 
                        className={`${workSans.className} px-4 py-3 text-white align-middle`}
                        style={{
                          fontWeight: 600,
                          fontSize: '25px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}
                      >
                        Fecha
                      </th>
                      <th 
                        className={`${workSans.className} px-4 py-3 text-white align-middle`}
                        style={{
                          fontWeight: 600,
                          fontSize: '25px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}
                      >
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-sky-50">
                    {adiciones.length > 0 ? (
                      adiciones.map((adicion, index) => (
                        <tr key={index} className="border-b border-sky-200 hover:bg-sky-100 transition-colors">
                          <td 
                            className={`${workSans.className} px-4 py-3 text-sky-800 align-middle`}
                            style={{
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%',
                              textAlign: 'center',
                              verticalAlign: 'middle'
                            }}
                          >
                            {formatearFecha(adicion.ADI_FECHA)}
                          </td>
                          <td 
                            className={`${workSans.className} px-4 py-3 text-sky-800 align-middle`}
                            style={{
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%',
                              textAlign: 'center',
                              verticalAlign: 'middle'
                            }}
                          >
                            {formatearValor(adicion.ADI_VALOR_ADICION)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-sky-600 font-medium">
                          No hay adiciones registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowAgregarAdicion(true)}
                  className={`${workSans.className} bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full transition-colors flex items-center space-x-2 mx-auto align-middle`}
                  style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  <span>+</span>
                  <span>Agregar Adición</span>
                </button>
              </div>
            </div>

            {/* Modificaciones */}
            <div>
              <h3 
                className={`${workSans.className} text-blue-900 mb-4 align-middle`}
                style={{
                  fontWeight: 700,
                  fontSize: '31.25px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                Modificaciones
              </h3>
              
              <div className="bg-blue-50 rounded-lg overflow-hidden border border-blue-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th 
                        className={`${workSans.className} px-4 py-3 text-white align-middle`}
                        style={{
                          fontWeight: 600,
                          fontSize: '25px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}
                      >
                        Tipo
                      </th>
                      <th 
                        className={`${workSans.className} px-4 py-3 text-white align-middle`}
                        style={{
                          fontWeight: 600,
                          fontSize: '25px',
                          lineHeight: '100%',
                          letterSpacing: '0%',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}
                      >
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-blue-50">
                    {modificaciones.length > 0 ? (
                      modificaciones.map((modificacion, index) => (
                        <tr key={index} className="border-b border-blue-200 hover:bg-blue-100 transition-colors">
                          <td 
                            className={`${workSans.className} px-4 py-3 text-blue-900 align-middle`}
                            style={{
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%',
                              textAlign: 'center',
                              verticalAlign: 'middle'
                            }}
                          >
                            {modificacion.MOD_TIPO}
                          </td>
                          <td 
                            className={`${workSans.className} px-4 py-3 text-blue-800 align-middle`}
                            style={{
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '100%',
                              letterSpacing: '0%',
                              textAlign: 'center',
                              verticalAlign: 'middle'
                            }}
                          >
                            {modificacion.MOD_DURACION} días
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-blue-600 font-medium">
                          No hay modificaciones registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button 
                  onClick={() => setShowAgregarModificacion(true)}
                  className={`${workSans.className} bg-blue-900 hover:bg-blue-950 text-white px-6 py-2 rounded-full transition-colors flex items-center space-x-2 mx-auto align-middle`}
                  style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}
                >
                  <span>+</span>
                  <span>Agregar Modificación</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas del proyecto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <h4 
                className={`${workSans.className} text-gray-900 mb-2 align-middle`}
                style={{
                  fontWeight: 700,
                  fontSize: '25px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                Costo total de obra ejecutada:
              </h4>
              <p className="font-bold text-green-600" style={{fontSize: '75.37px'}}>
                {seguimiento ? formatearValor(calcularCostoEjecutado()) : formatearValor(0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Basado en {seguimiento ? `${seguimiento.SEG_AVANCE_FINANCIERO}%` : '0%'} de avance financiero
              </p>
            </div>
            <div className="text-center">
              <h4 
                className={`${workSans.className} text-gray-900 mb-2 align-middle`}
                style={{
                  fontWeight: 700,
                  fontSize: '25px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}
              >
                Total de obra ejecutada:
              </h4>
              <p className="font-bold text-orange-500" style={{fontSize: '75.37px'}}>
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
              className={`${workSans.className} bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors flex items-center justify-center space-x-2 align-middle`}
              style={{
                fontWeight: 700,
                fontSize: '25px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Realizar Seguimiento General</span>
            </button>
            
            <button 
              onClick={() => router.push(`/seguimiento-actividades?contrato=${contrato.CON_ID}`)}
              className={`${workSans.className} bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors flex items-center justify-center space-x-2 align-middle`}
              style={{
                fontWeight: 700,
                fontSize: '25px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Realizar Seguimiento Por Actividad</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modal para Agregar Adición */}
      {showAgregarAdicion && contratoId && (
        <div className="fixed inset-0 z-50">
          <AgregarAdicionPage 
            contratoId={contratoId}
            onBackToHome={handleBackFromAdicion}
            onSuccess={handleAdicionSuccess}
          />
        </div>
      )}

              {/* Modal para Agregar Modificación */}
        {showAgregarModificacion && contratoId && (
          <div className="fixed inset-0 z-50">
            <AgregarModificacionPage 
              contratoId={contratoId}
              onBackToHome={() => setShowAgregarModificacion(false)}
              onModificacionCreated={() => {
                if (contratoId) {
                  loadContractData(contratoId);
                }
                setShowAgregarModificacion(false);
              }}
            />
          </div>
        )}
    </div>
  );
} 