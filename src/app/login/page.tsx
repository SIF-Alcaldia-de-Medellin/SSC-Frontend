"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import logo from '@/assets/logo-distrito-de-medellin.png';
import PublicRoute from '@/components/PublicRoute';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await login(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <PublicRoute redirectIfAuthenticated="/">
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-[#004884] bg-opacity-[0.95] max-w-1/2 p-[20px] rounded-2xl gap-[25px]">
          <div className='flex items-center justify-center gap-[15px]'>
            <Image 
              src={logo}
              alt="Logo Alcaldía de Medellín" 
              width={200}
              height={138}
              className='ml-5 max-w-[200px] max-h-[138px]' 
            />
            <hr className="w-[5px] min-h-[138px] bg-gray-200 "></hr>
            <h1 className="text-[32px] text-[#FFFFFF] font-medium">
              Sistema de Seguimiento de Contratos
            </h1>
          </div>
          <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-[25px]'>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-[40px] text-center text-[16px] font-medium border border-gray-300 rounded-md shadow-sm placeholder-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-300"
              placeholder="Correo Institucional"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full h-[40px] text-center text-[16px] font-medium border border-gray-300 rounded-md shadow-sm placeholder-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300"
              placeholder="Contraseña"
            />
            {loading ? <button
              type="submit"
              className="bg-[#FF8403] hover:bg-[#D76E00] hover:scale-105 transition-all duration-300 cursor-pointer text-white px-4 py-2 rounded-full w-fit min-w-[128.05px]"
            >
              <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </button> : <button
              type="submit"
              className="bg-[#FF8403] hover:bg-[#D76E00] hover:scale-105 transition-all duration-300 cursor-pointer text-white px-4 py-2 rounded-full w-fit"
            >
              Iniciar Sesión
            </button>}
            {error && 
              <div className="max-w-[80%] bg-red-500 text-sm p-2 rounded-md text-white flex gap-1.5 justify-center items-center">
                <FontAwesomeIcon icon={faXmark} className='text-5xl'/><p className='text-[16px] font-medium'>{error}</p>
              </div>
            }
          </form>
        </div>
      </div>
    </PublicRoute>
  );
}
