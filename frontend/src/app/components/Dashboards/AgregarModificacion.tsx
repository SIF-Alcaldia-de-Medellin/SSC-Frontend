"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface AgregarModificacionPageProps {
  onBackToHome?: () => void;
}

export default function AgregarModificacionPage({ onBackToHome }: AgregarModificacionPageProps = {}) {
  const [userRole] = useState('supervisor');
  const router = useRouter();
  const searchParams = useSearchParams();
  const contratoId = searchParams.get('contrato');
  const [formData, setFormData] = useState({
    tipoModificacion: '',
    fechasInicio: '2025-06-24',
    fechasFinal: '2025-07-24',
    observaciones: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.tipoModificacion || !formData.fechasInicio || !formData.fechasFinal) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Simular guardado de modificación
    console.log('Guardando modificación:', {
      contratoId,
      ...formData
    });

    // Mostrar confirmación y regresar al contrato
    alert('Modificación guardada exitosamente');
    handleBackToHome();
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
            <span className="text-white text-base">
              Bienvenido, {userRole}
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
            Agregar Modificación
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* LAYOUT HORIZONTAL ALARGADO: Tipo | Fechas | Duración */}
            <div className="flex items-center space-x-8 bg-gray-50 p-6 rounded-lg">
              
              {/* COLUMNA 1: Tipo de modificación */}
              <div className="flex-1">
                <label className={`${workSans.className} block text-gray-700 mb-3`} style={{ fontWeight: 600, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
                  <span className="text-red-600 text-xl font-bold">*</span> Tipo de modificación
                </label>
                <select
                  name="tipoModificacion"
                  value={formData.tipoModificacion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-lg font-medium"
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Tipo 1</option>
                  <option value="2">Tipo 2</option>
                  <option value="3">Tipo 3</option>
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
                    name="fechasInicio"
                    value={formData.fechasInicio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg font-medium"
                  />
                </div>
                
                <div>
                  <label className={`${workSans.className} block text-gray-700 mb-2`} style={{ fontWeight: 600, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
                    <span className="text-red-600 text-xl font-bold">*</span> Fecha Final
                  </label>
                  <input
                    type="date"
                    name="fechasFinal"
                    value={formData.fechasFinal}
                    onChange={handleInputChange}
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
                  <div className="text-purple-600 font-bold text-3xl">30 días</div>
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
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 