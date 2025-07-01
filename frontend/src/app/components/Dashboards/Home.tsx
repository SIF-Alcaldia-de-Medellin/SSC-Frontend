"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      "CON_ESTADO": "ACTIVO",
      "CON_CONTRATISTA": "TERMINALES DE TRANSPORTE MEDELLÍN S.A.",
      "CON_VALOR_TOTAL": 1745728320,
      "CON_FECHA_INI": "2025-01-01",
      "CON_FECHA_TER_ACT": "2025-10-15"
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
      "CON_ESTADO": "ACTIVO",
      "CON_CONTRATISTA": "CONSTRUCTORA VÍAS S.A.S.",
      "CON_VALOR_TOTAL": 2500000000,
      "CON_FECHA_INI": "2025-02-01",
      "CON_FECHA_TER_ACT": "2025-08-01"
    }
  ]
};

// Interfaces
interface Usuario {
  USU_CEDULA: number;
  USU_EMAIL: string;
  USU_ROL: string;
  USU_NOMBRE: string;
  USU_CREATED_AT: string;
  USU_UPDATED_AT: string;
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
  CON_ESTADO: string;
  CON_CONTRATISTA: string;
  CON_VALOR_TOTAL: number;
  CON_FECHA_INI: string;
  CON_FECHA_TER_ACT: string;
}

export default function HomePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cargar datos iniciales
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      const userInfo = JSON.parse(userData);
      setUsuario(userInfo);
      
       setTimeout(() => {
         const contratosActivos = sscData.contratos.filter((c: Contrato) => c.CON_ESTADO === 'ACTIVO');
         setContratos(contratosActivos);
         setLoading(false);
       }, 500);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      router.push('/');
    }
  }, [router]);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleContratoClick = (contratoId: number) => {
    router.push(`/contratos?id=${contratoId}`);
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
      month: 'short',
      day: 'numeric'
    });
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
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
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            ¿Que <span className="text-blue-600">contrato</span> deseas realizarle seguimiento?
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-center justify-center">
              <div className="col-span-full text-center text-gray-500 text-lg">
                <div className="bg-gray-100 rounded-lg p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-xl font-medium">Cargando contratos...</p>
                </div>
              </div>
            </div>
          ) : contratos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contratos.map((contrato) => (
                <div 
                  key={contrato.CON_ID}
                  onClick={() => handleContratoClick(contrato.CON_ID)}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {contrato.CON_TIPO_CONTRATO}
                    </div>
                    <div className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-medium">
                      {contrato.CON_ESTADO}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {contrato.CON_IDENTIFICADOR_SIMPLE}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {contrato.CON_OBJETO}
                  </p>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contratista:</span>
                      <span className="font-medium text-right text-xs max-w-[60%]">
                        {contrato.CON_CONTRATISTA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor:</span>
                      <span className="font-medium text-green-600">
                        {formatearValor(contrato.CON_VALOR_TOTAL)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Programa:</span>
                      <span className="font-medium text-right text-xs max-w-[60%]">
                        {contrato.CON_PROGRAMA}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Inicio:</span>
                      <span className="font-medium">
                        {formatearFecha(contrato.CON_FECHA_INI)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600 font-medium group-hover:text-blue-700">
                        Ver detalles →
                      </span>
                      <span className="text-gray-400">
                        #{contrato.CON_NRO_CONTRATO}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-center justify-center">
              <div className="col-span-full text-center text-gray-500 text-lg">
                <div className="bg-gray-100 rounded-lg p-12">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium mb-2">No hay contratos activos</p>
                  <p className="text-gray-400">No se encontraron contratos activos para mostrar</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}