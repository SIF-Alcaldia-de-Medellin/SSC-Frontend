"use client";
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import './home.css';
import Card from '@/components/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useContratos } from '@/hooks/useContratos';
import { Contrato } from '@/types/contrato';
import { formatDate } from '@/utils/formatDate';
import NoContent from '@/components/NoContent';
import { useNotifier } from '@/context/NotifierContext';
import { useState, useEffect, useRef } from 'react';

export default function HomePage() {
  const {loading, error, contratos} = useContratos();
  const { logout } = useAuth();
  const router = useRouter();
  const { setNotification } = useNotifier();

  const hasNotifiedRef = useRef(false);
  const [contratosFiltrados, setContratosFiltrados] = useState<Array<Contrato>>([]);

  useEffect(() => {
    if (error && !hasNotifiedRef.current) {
      setNotification({ message: error, type: "error" });

      if (error.includes("Unauthorized")) {
        logout();
      }

      hasNotifiedRef.current = true;
    }
  }, [error, setNotification, logout]);

  // Reset the flag if error is cleared
  useEffect(() => {
    if (!error) {
      hasNotifiedRef.current = false;
    }
  }, [error]);

  useEffect(()=>{
    setContratosFiltrados(contratos || []);
  },[contratos]);

  const handleSelectContract = (contract: Contrato) => {
    router.push(`/contratos/${contract.id}`);
  }

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.toUpperCase();
    if(value == '') return setContratosFiltrados(contratos || []);
    const contratosFiltrados = contratos?.filter((contrato)=>contrato?.numeroContrato.includes(value) || contrato?.identificadorSimple.toUpperCase().includes(value));
    setContratosFiltrados(contratosFiltrados || []);
  }

  return (
    <ProtectedRoute>
      <Header />
      <main className='
        flex 
        justify-center 
        items-center 
        min-h-[calc(100dvh-110px)]
      '>
        <div className='
          flex 
          flex-col 
          justify-center 
          items-center 
          bg-white 
          rounded-2xl 
          my-[20px]
          p-[20px] 
          w-[85%] 
          gap-[20px]
        '>
          <div className='
            flex 
            flex-col 
            justify-center 
            items-center 
            gap-[20px]
            w-full
          '>
            <h1 className='text-[48.8px] font-bold text-center'>
              ¿Que <span className='text-[#3366CC]'>contrato</span> deseas realizarle seguimiento?
            </h1>
            <div className='mt-[-10px] flex flex-row w-full items-center justify-center gap-[20px]'>
              <input className='bg-white w-[calc(1/3*100%-20px)] border border-gray-400 rounded-full px-4 py-2 focus:outline-[#3366CC]' type="search" name="search" id="search" placeholder='Buscar Contrato' onChange={handleFilter}/>
              <div className='flex bg-[#3366CC] opacity-80 h-[3px] w-[calc((1/3*100%-20px)*2+20px)]'></div>
            </div>
            {loading ? 
              (<>
              <LoadingSpinner hexColor="3366CC" className='fill-blue-500'  />
              <p className='text-[20px] font-semibold text-center'>Cargando...</p>
              </>) 
              : 
              (<div className='flex flex-wrap gap-[20px] justify-center items-stretch w-full'>
                {/* Card */}
                {contratosFiltrados?.map((contract: Contrato, index: number) => (
                  <Card 
                    className={`justify-evenly max-w-[calc(1/3*100%-20px)] min-w-[calc(1/3*100%-20px)] w-[calc(1/3*100%-20px)] min-h-[250px] ` + (index % 2 == 0 ? 'bg-[#FF8403]' : 'bg-[#00CD6C]')} 
                    title={`${contract.identificadorSimple}`}
                    subtitle={`Contrato #${contract.numeroContrato}`}
                    key={contract.id}
                  >
                    <div>
                      <p className='text-[16px] font-normal h-[50px] w-full line-clamp-2'>{contract.objeto}</p>
                      <p className=' font-light'><span className='font-semibold'>Contratista: </span>{contract.contratista}</p>
                      <div className='flex flex-row justify-between items-center w-full'>
                        <div>
                          <span className='font-semibold'>Inicio: </span><p className='text-[16px] font-light'>{formatDate(contract.fechaInicio)}</p>
                        </div>
                        <div>
                          <span className='font-semibold'>Terminación: </span>
                          <p className='text-[16px] font-light'>{formatDate(contract.fechaTerminacionActual)}</p>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-[5px] self-end items-end mt-[15px]'>
                      <h6 className='text-white text-[20px] w-fit font-semibold'>
                        Valor: {formatCurrency(Number(contract.valorTotal))}
                      </h6>
                      <button className='bg-[#3366CC] hover:bg-[#2A55AA] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={() => handleSelectContract(contract)}>Seleccionar</button>
                    </div>
                  </Card>
                ))}
              </div>)
            }
            {!loading && contratosFiltrados?.length === 0 && <NoContent element="contrato" />}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
