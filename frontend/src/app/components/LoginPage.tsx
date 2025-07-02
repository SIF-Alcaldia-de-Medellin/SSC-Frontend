"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '700', '800'],
});

// Importar el simulador de API directamente
const usuariosSimulados = [
  {
    USU_CEDULA: 12345678,
    USU_EMAIL: "admin@medellin.gov.co",
    USU_PASSWORD: "admin123",
    USU_ROL: "admin",
    USU_NOMBRE: "María González",
    USU_CREATED_AT: "2024-01-15T09:00:00Z",
    USU_UPDATED_AT: "2024-01-15T09:00:00Z"
  },
  {
    USU_CEDULA: 87654321,
    USU_EMAIL: "supervisor@medellin.gov.co",
    USU_PASSWORD: "super123",
    USU_ROL: "supervisor",
    USU_NOMBRE: "Carlos Ramírez",
    USU_CREATED_AT: "2024-01-15T09:00:00Z",
    USU_UPDATED_AT: "2024-01-15T09:00:00Z"
  },
  {
    USU_CEDULA: 11223344,
    USU_EMAIL: "jefe@medellin.gov.co",
    USU_PASSWORD: "jefe123",
    USU_ROL: "jefe",
    USU_NOMBRE: "Ana Martínez",
    USU_CREATED_AT: "2024-01-15T09:00:00Z",
    USU_UPDATED_AT: "2024-01-15T09:00:00Z"
  }
];

export default function LoginPage() {
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor completa todos los campos');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      // Buscar usuario en los datos simulados
      const usuario = usuariosSimulados.find(u => 
        u.USU_EMAIL.toLowerCase() === email.toLowerCase()
      );

      if (!usuario) {
        setErrorMessage('Usuario no encontrado');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      if (usuario.USU_PASSWORD !== password) {
        setErrorMessage('Contraseña incorrecta');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }

      // Autenticación exitosa
      const usuarioSinPassword = {
        USU_CEDULA: usuario.USU_CEDULA,
        USU_EMAIL: usuario.USU_EMAIL,
        USU_ROL: usuario.USU_ROL,
        USU_NOMBRE: usuario.USU_NOMBRE,
        USU_CREATED_AT: usuario.USU_CREATED_AT,
        USU_UPDATED_AT: usuario.USU_UPDATED_AT
      };

      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(usuarioSinPassword));
      localStorage.setItem('token', `mock_token_${usuario.USU_CEDULA}_${Date.now()}`);
      
      // Redireccionar al home
      router.push('/home');

    } catch {
      setErrorMessage('Error de conexión. Intenta nuevamente.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
   
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

      
      <div className="bg-blue-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-start space-x-4 mb-8">
          <div className="bg-blue-900 rounded-lg p-2 shadow-lg">
            <Image
              src={logoMedellin}
              alt="Alcaldía de Medellín"
              width={140}
              height={120}
              className="w-60 h-30 object-contain"
            />
          </div>
          
          <div className="w-px h-28 bg-white opacity-50"></div>
          
          <div className="text-white">
            <h1 
              className={`${workSans.className} text-white align-middle`}
              style={{
                fontWeight: 500,
                fontSize: '23px',
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
                marginTop: '16px'
              }}
            >
              SISTEMA DE SEGUIMIENTO DE CONTRATOS
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Correo Institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 placeholder-gray-500 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 placeholder-gray-500 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* Credenciales de prueba */}
          <div className="bg-blue-700 text-white px-4 py-3 rounded-lg">
            <p className="text-xs font-semibold mb-2">💡 Credenciales de Prueba:</p>
            <div className="text-xs space-y-1">
              <p><strong>Admin:</strong> admin@medellin.gov.co / admin123</p>
              <p><strong>Supervisor:</strong> supervisor@medellin.gov.co / super123</p>
              <p><strong>Jefe:</strong> jefe@medellin.gov.co / jefe123</p>
            </div>
          </div>

          {showError && (
            <div className="bg-red-600 text-white px-4 py-3 rounded-lg flex items-center space-x-2">
              <span className="text-xl">✕</span>
              <span className="text-sm">
                {errorMessage}
              </span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-6 disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando Sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}