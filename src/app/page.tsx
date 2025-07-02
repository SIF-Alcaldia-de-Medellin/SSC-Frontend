"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import './home.css';
import Card from '@/components/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import sscData from '@/services/mocks/data';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Contract {
  id: number;
  numeroContrato: string;
  anoSuscripcion: number;
  programa: string;
  tipoContrato: string,
  objeto: string;
  identificadorSimple: string;
  suplentes: string;
  apoyo: string;
  estado: string;
  contratista: string;
  numeroProceso: string;
  fechaInicio: string;
  fechaTerminacionInicial: string;
  fechaTerminacionActual: string;
  valorInicial: number;
  valorTotal: number;
  supervisor?: object | null;
}

const mockData: Contract[] = sscData.contratos;

export default function HomePage() {

  const router = useRouter();

  const handleSelectContract = (contract: Contract) => {
    router.push(`/contratos/${contract.id}`);
  }

  return (
    <ProtectedRoute>
      <Header />
      <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
        <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px]'>
          <h1 className='text-[48.8px] font-bold text-center'>
            ¿Que <span className='text-[#3366CC]'>contrato</span> deseas realizarle seguimiento?
          </h1>
          {Math.random() > 0.5 ? 
            (<>
            <LoadingSpinner hexColor="3366CC"  />
            <p className='text-[20px] font-semibold text-center'>Cargando...</p>
            </>) 
            : 
            (<div className='flex flex-wrap gap-[20px] justify-center items-center'>
              {/* Card */}
              {mockData.map((contract: Contract, index: number) => (
                <Card 
                  className={"w-[calc(1/3*100%-20px)] min-h-[250px] " + (index % 2 == 0 ? 'bg-[#FF8403]' : 'bg-[#00CD6C]')} 
                  title={`Contrato #${contract.numeroContrato}`} 
                  subtitle={`Vigencia: ${contract.anoSuscripcion}`}
                  key={contract.id}
                >
                  <p className='text-[16px] font-normal h-[70px] w-full line-clamp-3'>{contract.objeto}</p>
                  <div className='flex flex-col gap-[5px] self-end items-end'>
                    <h6 className='text-white text-[20px] w-fit font-semibold'>
                      Valor: {formatCurrency(contract.valorTotal)}
                    </h6>
                    <button className='bg-[#3366CC] hover:bg-[#2A55AA] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={() => handleSelectContract(contract)}>Seleccionar</button>
                  </div>
                </Card>
              ))}
            </div>)
          }
        </div>
      </main>
    </ProtectedRoute>
  );
}
