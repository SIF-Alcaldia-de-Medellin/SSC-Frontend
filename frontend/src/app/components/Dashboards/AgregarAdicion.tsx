"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logoMedellin from '@/assets/logo-medellin.png';

// Datos básicos de contratos para mostrar contexto
const sscData = {
  "contratos": [
    {
      "CON_ID": 1,
      "CON_NRO_CONTRATO": 460010403,
      "CON_IDENTIFICADOR_SIMPLE": "#460010403",
      "CON_TIPO_CONTRATO": "INTERVENTORÍA",
      "CON_CONTRATISTA": "TERMINALES DE TRANSPORTE MEDELLÍN S.A."
    },
    {
      "CON_ID": 2,
      "CON_NRO_CONTRATO": 460010404,
      "CON_IDENTIFICADOR_SIMPLE": "#460010404",
      "CON_TIPO_CONTRATO": "OBRA PÚBLICA",
      "CON_CONTRATISTA": "CONSTRUCTORA VÍAS S.A.S."
    }
  ]
};

interface Usuario {
  USU_CEDULA: number;
  USU_EMAIL: string;
  USU_ROL: string;
  USU_NOMBRE: string;
}

interface ContratoBasico {
  CON_ID: number;
  CON_NRO_CONTRATO: number;
  CON_IDENTIFICADOR_SIMPLE: string;
  CON_TIPO_CONTRATO: string;
  CON_CONTRATISTA: string;
}

interface AgregarAdicionPageProps {
  onBackToHome?: () => void;
}

export default function AgregarAdicionPage({ onBackToHome }: AgregarAdicionPageProps = {}) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [contrato, setContrato] = useState<ContratoBasico | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fechasAdicion: '',
    valorAdicion: '',
    observaciones: ''
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const contratoId = searchParams.get('contrato');

  useEffect(() => {
    // Verificar autenticación
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      const userInfo = JSON.parse(userData);
      setUsuario(userInfo);
      
      // Si no hay ID de contrato, redirigir al home
      if (!contratoId) {
        router.push('/home');
        return;
      }
      
      // Buscar datos básicos del contrato
      const contratoEncontrado = sscData.contratos.find(c => c.CON_ID.toString() === contratoId);
      if (!contratoEncontrado) {
        router.push('/home');
        return;
      }

      setContrato(contratoEncontrado);
      setLoading(false);

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
    } else if (contratoId) {
      // Regresar al contrato específico
      router.push(`/contratos?id=${contratoId}`);
    } else {
      router.push('/home');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.fechasAdicion || !formData.valorAdicion || !formData.observaciones) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Simular guardado de adición
    console.log('Guardando adición:', {
      contratoId,
      ...formData
    });

    // Mostrar confirmación y regresar al contrato
    alert('Adición guardada exitosamente');
    handleBackToHome();
  };

  if (loading || !usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando formulario...</p>
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
            onClick={() => router.push('/home')}
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
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
          {/* Información del contrato */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Contrato:</h3>
            <div className="text-sm text-blue-700">
              <p><strong>ID:</strong> {contrato.CON_IDENTIFICADOR_SIMPLE}</p>
              <p><strong>Tipo:</strong> {contrato.CON_TIPO_CONTRATO}</p>
              <p><strong>Contratista:</strong> {contrato.CON_CONTRATISTA}</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Agregar Adición
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Adición *
                </label>
                <input
                  type="date"
                  name="fechasAdicion"
                  value={formData.fechasAdicion}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor de la adición *
                </label>
                <input
                  type="number"
                  name="valorAdicion"
                  value={formData.valorAdicion}
                  onChange={handleInputChange}
                  placeholder="Ej: 100000000"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones *
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={6}
                placeholder="Describa la razón de la adición, justificación y otros detalles relevantes..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleBackToHome}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Guardar Adición
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 