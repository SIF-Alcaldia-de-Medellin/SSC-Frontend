"use client";
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faListCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useContratoInfo } from '@/hooks/useContratoInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import BackButton from '@/components/BackButton';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifier } from '@/context/NotifierContext';
import { Modificacion } from '@/types/modificacion';
import { Adicion } from '@/types/adicion';

export default function ContratosPage() {
  const router = useRouter();
  const { id } = useParams();
  const { loading, error, contrato, modificaciones, adiciones, seguimientoGeneral } = useContratoInfo(Number(id));
  const { logout } = useAuth();
  const { setNotification } = useNotifier();

  const handleAgregarAdicion = () => {
    router.push(`/contratos/${id}/agregar-adicion`);
  }

  const handleAgregarModificacion = () => {
    router.push(`/contratos/${id}/agregar-modificacion`);
  }

  const handleSeguimientoGeneral = () => {
    router.push(`/contratos/${id}/seguimiento-general`);
  }

  const handleSeguimientoPorActividad = () => {
    router.push(`/seguimiento-actividad/cuos?contratoId=${id}`);
  }

  useEffect(() => {
    if(!!error) setNotification({ message: error, type: 'error' });
    if(error?.includes("Unauthorized")) logout();
    if(error?.includes("Contrato no encontrado")) router.push(`/`);
    if(error?.includes("No tienes acceso a este contrato")) router.push(`/`);
  }, [error, setNotification]);

  return (
    <ProtectedRoute>
      <Header />
      <main className='flex justify-center items-center min-h-[calc(100dvh-110px)] my-[20px]'>
        <div className='flex flex-col justify-center items-center bg-white rounded-2xl px-[80px] py-[20px] w-[85%] gap-[20px]'>
          {loading ? 
            (<>
            <LoadingSpinner hexColor='00AEEF' className='fill-fuchsia-700'/> 
            <p className='text-[20px] font-semibold text-center'>Cargando...</p>
            </>) 
          :
            (
            <>
            <section className='flex justify-between items-center w-full'>
              <h1 className='text-[48.8px] font-bold text-[#AE3E97]'>Contrato #{contrato?.numeroContrato}</h1>
              <div className='p-[10px] bg-[#AE3E97] rounded-2xl text-white px-[20px] py-[10px] text-center'>
                <p className='text-[25px] font-bold text-center'>Tipo:<br />{contrato?.tipoContrato.toUpperCase()}</p>
              </div>
            </section>
            <div className='flex justify-between items-center w-full'>
              <div className='flex gap-[10px] items-center w-[60%]'>
                <h6 className='text-[25px] font-bold text-[#742965] w-[150px]'>Objeto:</h6>
                <p className='w-[70%]'>{contrato?.objeto}</p>
              </div>
              <div className='flex gap-[10px] justify-between items-center w-[40%]'>
                <h6 className='text-[25px] font-bold text-[#742965] text-center w-[155px]'>Valor Inicial:</h6>
                <p className='text-[25px] font-medium'>{formatCurrency(Number(contrato?.valorInicial) ?? 0)}</p>
              </div>
            </div>
            <div className='flex justify-between items-center w-full'>
              <div className='flex gap-[10px] items-center w-[60%]'>
                <h6 className='block text-[25px] font-bold text-[#742965] w-[150px]'>Contratista:</h6>
                <p className='w-[70%]'>{contrato?.contratista}</p>
              </div>
              <div className='flex gap-[10px] justify-between items-center w-[40%]'>
                <h6 className='text-[25px] font-bold text-[#742965] text-center w-[155px]'>Valor Total:</h6>
                <p className='text-[25px] font-medium'>{formatCurrency(Number(contrato?.valorTotal) ?? 0)}</p>
              </div>
            </div>
            <div className='flex justify-between items-center w-full'>
              <div className='flex gap-[10px] items-center w-[60%]'>
                <h6 className='text-[25px] font-bold text-[#742965] w-[150px]'>Fecha de Inicio:</h6>
                <p className='w-[70%]'>{formatDate(contrato?.fechaInicio ?? '')}</p>
              </div>
              <div className='flex gap-[10px] justify-between items-center w-[40%]'>
                <h6 className='text-[25px] font-bold text-[#742965] text-center w-[155px]'>Fecha de<br />Finalización:</h6>
                <p className='text-[25px] font-medium'>{formatDate(contrato?.fechaTerminacionActual ?? '')}</p>
              </div>
            </div>
            <hr className='w-full h-[5px] bg-[#B5B5B5] border-0 rounded-3xl'/>
            {/* Aditions and modifications */}
            <section className='flex justify-between items-center w-full'>
              <div className='flex flex-col gap-[10px] w-[calc(50%-10px)]'>
                <h2 className='text-[25px] font-bold text-center text-[#0091C7]'>Adiciones</h2>
                <div className='rounded-2xl overflow-hidden'>
                  <table className='w-full '>
                    <thead className='bg-[#0091C7]'>
                      <tr className='text-center text-[20px] font-semibold text-white text-white  py-[10px]'>
                        <th className='py-[10px]'>Fecha</th>
                        <th className='py-[10px]'>Valor</th>
                      </tr>
                    </thead>
                    <tbody className='bg-[#A5E6FF] text-[#001D28] text-[16px]'>
                      {adiciones?.map((adicion) => (
                        <tr key={adicion.id} className='text-center font-normal py-[10px] hover:bg-[#78DAFF]'>
                          <td className='py-[10px]'>{formatDate(adicion.fecha)}</td>
                          <td className='py-[10px]'>{formatCurrency(adicion.valorAdicion)}</td>
                        </tr>
                      ))}
                    </tbody>
                    {adiciones?.length > 0 && 
                      <tfoot className='bg-[#78DAFF]'>
                        <tr className='text-center font-normal py-[10px] font-semibold'>
                          <td className='py-[10px] text-end'>Valor Total de Adiciones:</td>
                          <td className='py-[10px]'>{
                            formatCurrency(adiciones?.reduce((accumulator, adicion) => accumulator + Number(adicion?.valorAdicion ?? 0), 0))}
                          </td>
                        </tr>
                      </tfoot>
                    }
                  </table>
                  {adiciones?.length === 0 && (
                    <div className='text-center font-normal py-[10px] bg-[#A5E6FF] hover:bg-[#78DAFF] w-full'>
                      <span className='py-[10px]'>No hay adiciones hasta la fecha...</span>
                    </div>
                  )}
                </div>
                <button className='bg-[#00AEEF] hover:bg-[#0091C7] text-white px-[20px] py-[10px] rounded-full w-fit self-end mr-4 cursor-pointer font-semibold' onClick={handleAgregarAdicion}>
                  <FontAwesomeIcon icon={faPlus} /> Agregar Adición
                </button>
              </div>
              <div className='flex flex-col gap-[10px] w-[calc(50%-10px)]'>
                <h2 className='text-[25px] font-bold text-center text-[#003C6E]'>Modificaciones</h2>
                <div className='rounded-2xl overflow-hidden'>
                  <table className='w-full '>
                    <thead className='bg-[#003C6E]'>
                      <tr className='text-center text-[20px] font-semibold text-white text-white  py-[10px]'>
                        <th className='py-[10px]'>Tipo</th>
                        <th className='py-[10px]'>Fecha</th>
                        <th className='py-[10px]'>Duración</th>
                      </tr>
                    </thead>
                    <tbody className='bg-[#C0E2FF] text-[#001D28] text-[16px]'>
                      {modificaciones?.map((modificacion) => (
                        <tr key={modificacion.id} className='text-center font-normal py-[10px] hover:bg-[#81C6FF]'>
                          <td className='py-[10px]'>{modificacion.tipo}</td>
                          <td className='py-[10px]'>{formatDate(modificacion.fechaInicio)}</td>
                          <td className='py-[10px]'>{modificacion.duracion} días</td>
                        </tr>
                      ))}
                    </tbody>
                    {modificaciones?.length > 0 && 
                      <tfoot className='bg-[#81C6FF]'>
                        <tr className='text-center font-normal py-[10px] font-semibold'>
                          <td></td>
                          <td className='py-[10px] text-end'>Duración Total:</td>
                          <td className='py-[10px]'>
                            {modificaciones?.reduce((accumulator, modificacion) => accumulator + Number(modificacion?.duracion ?? 0), 0)} dias
                          </td>
                        </tr>
                      </tfoot>
                    }
                  </table>
                  {modificaciones?.length === 0 && (
                    <div className='text-center font-normal py-[10px] bg-[#C0E2FF] hover:bg-[#81C6FF] w-full'>
                      <span className='py-[10px]'>No hay modificaciones hasta la fecha...</span>
                    </div>
                  )}
                </div>
                <button className='bg-[#004884] hover:bg-[#003C6E] text-white px-[20px] py-[10px] rounded-full w-fit self-end mr-4 cursor-pointer font-semibold' onClick={handleAgregarModificacion}>
                  <FontAwesomeIcon icon={faPlus} /> Agregar Modificación
                </button>
              </div>
            </section>
            <hr className='w-full h-[5px] bg-[#B5B5B5] border-0 rounded-3xl'/>
            {/* Seguimiento del contrato */}
            <section className='flex justify-center items-center w-full gap-[20px]'>
              <div className='flex flex-col gap-[10px] w-[calc(50%-10px)] text-center'>
                <h6 className='font-semibold text-[20px]'>Coste total de obra ejecutada:</h6>
                <h2 className='text-[55px] font-extrabold'>{formatCurrency(Number(!seguimientoGeneral || !seguimientoGeneral.valorEjecutado ? '0' : seguimientoGeneral.valorEjecutado.toFixed(0)))}</h2>
                <button className='bg-[#3366CC] hover:bg-[#2A55AA] text-white px-[20px] py-[20px] rounded-2xl cursor-pointer text-[20px] font-semibold self-center w-[90%] flex items-center justify-center gap-[10px]' onClick={handleSeguimientoGeneral}>
                  <FontAwesomeIcon icon={faFileLines} className='text-[36px]' /> Realizar Seguimiento General
                </button>
              </div>
              <div className='flex flex-col gap-[10px] w-[calc(50%-10px)] text-center'>
                <h6 className='font-semibold text-[20px]'>Total de obra ejecutada:</h6>
                <h2 className='text-[55px] font-extrabold'>{!seguimientoGeneral ? '0' : seguimientoGeneral?.avanceFisico}%</h2>
                <button className='bg-[#FF8403] hover:bg-[#D76E00] text-white px-[20px] py-[20px] rounded-2xl cursor-pointer text-[20px] font-semibold  self-center w-[90%] flex items-center justify-center gap-[10px]' onClick={handleSeguimientoPorActividad}>
                  <FontAwesomeIcon icon={faListCheck} className='text-[36px]' /> Realizar Seguimiento Por Actividad
                </button>
              </div>
            </section>
            </>
          )}
        </div>
        <BackButton />
      </main>
    </ProtectedRoute>
  );
} 