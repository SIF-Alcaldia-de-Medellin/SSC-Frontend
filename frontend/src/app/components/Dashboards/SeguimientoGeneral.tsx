"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

interface SeguimientoGeneralPageProps {
  onBackToHome?: () => void;
}

export default function SeguimientoGeneralPage({ onBackToHome }: SeguimientoGeneralPageProps = {}) {
  // Estados
  const [userRole] = useState('supervisor');
  const [formData, setFormData] = useState({
    avanceFinanciero: '1592155',
    porcentajeFinanciero: '',
    avanceFisico: '30',
    porcentajeFisico: '',
    observaciones: ''
  });

  // Handlers
  const handleLogout = () => {
    console.log('Cerrando sesión...');
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
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
    console.log('Datos del seguimiento:', formData);
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
            <span className="text-white text-base">
              Bienvenido, {userRole}
            </span>
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financiero */}
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
                    $ {parseInt(formData.avanceFinanciero).toLocaleString()}
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
                    % de Avance Financiero <span className="text-red-600 text-xl font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="porcentajeFinanciero"
                    value={formData.porcentajeFinanciero}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                  />
                </div>
              </div>

              {/* Físico */}
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
                    name="porcentajeFisico"
                    value={formData.porcentajeFisico}
                    onChange={handleInputChange}
                    placeholder="0"
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