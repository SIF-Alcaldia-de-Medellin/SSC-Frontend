"use client";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useActividadInfo } from "@/hooks/useActividadInfo";
import { formatCurrency } from "@/utils/formatCurrency";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useNotifier } from "@/context/NotifierContext";
import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/formatDate";

export default function SeguimientoActividadFormularioPage() {
    const { id_actividad: actividadId, id: cuoId } = useParams();
    const searchParams = useSearchParams();
    const contratoId = searchParams.get('contratoId');
    const router = useRouter();
    const { setNotification } = useNotifier();
    const { logout } = useAuth();
    const { loading, error, seguimientosActividad } = useActividadInfo(Number(actividadId));

    useEffect(() => {
        if(!!error) setNotification({ message: error, type: 'error' });
        if(error?.includes("Unauthorized")) logout();
        if(error?.includes("No se encontró la actividad con ID")) router.push(`/cuos/${cuoId}/actividades?contratoId=${contratoId}`);
        if(error?.includes("No tienes acceso a este contrato")) router.push(`/`);
    }, [error, setNotification]);

    return (
        <ProtectedRoute>
            <Header />
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-[20px]'>
                    {loading ? (
                        <>
                        <div className='flex items-center justify-center'><LoadingSpinner hexColor='3366CC' className='fill-[#3366CC]' /></div>
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                        </>
                    ) : (
                        <>
                        <div>
                            <h1 className='text-[48.8px] font-bold text-center text-[#3366CC]'>
                                {seguimientosActividad[0]?.actividad && 'descripcion' in seguimientosActividad[0].actividad ? seguimientosActividad[0].actividad.descripcion : (seguimientosActividad[0]?.actividad && 'actividad' in seguimientosActividad[0].actividad ? seguimientosActividad[0].actividad.actividad : '')}
                            </h1>
                        </div>
                        <div className='rounded-2xl overflow-hidden w-[85%]'>
                            <table className='w-full'>
                                <thead className="bg-[#004884] font-semibold text-white">
                                    <tr className="text-center text-[20px]  py-[10px]">
                                        <td className="py-[10px]">Fecha Reporte</td>
                                        <td className="py-[10px]">Descripción</td>
                                        <td className="py-[10px]">Avance Fisico Ejecutado</td>
                                        <td className="py-[10px]">Costo Aproximado</td>
                                    </tr>
                                </thead>
                                <tbody className='bg-[#C0E2FF] text-[#001D28] text-[16px]'>
                                    {seguimientosActividad?.length > 0 && !!seguimientosActividad[0].id && seguimientosActividad?.reverse().map((seguimiento) => (
                                    <tr key={seguimiento.id} className='text-center font-normal py-[10px] hover:bg-[#81C6FF]'>
                                        <td className='py-[10px]'>{formatDate(seguimiento.createdAt || '')}</td>
                                        <td className='py-[10px]'>{seguimiento.descripcionSeguimiento}</td>
                                        <td className='py-[10px]'>{seguimiento.avanceFisico}{seguimiento.actividad.unidadesAvance}</td>
                                        <td className='py-[10px]'>{formatCurrency(seguimiento.costoAproximado || 0)}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                {seguimientosActividad?.length > 0 && !!seguimientosActividad[0].id && 
                                    <tfoot className='bg-[#81C6FF]'>
                                        <tr className='text-center font-normal py-[10px] font-semibold'>
                                            <td></td>
                                            <td className='py-[10px] text-end'>Totales:</td>
                                            <td className='py-[10px]'>
                                                {seguimientosActividad[0].avanceAcumulado}{seguimientosActividad[0].actividad.unidadesAvance}
                                            </td>
                                            <td className='py-[10px]'>
                                                {formatCurrency(seguimientosActividad[0].costoAcumulado || 0)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                }
                            </table>
                            {seguimientosActividad?.length > 0 && !seguimientosActividad[0].id && (
                                <div className='text-center font-normal py-[10px] bg-[#C0E2FF] hover:bg-[#81C6FF] w-full'>
                                <span className='py-[10px]'>No se han realizado seguimiento a la actividad hasta la fecha...</span>
                                </div>
                            )}
                        </div>
                        <button className="text-white bg-[#3366CC] hover:bg-[#2A55AA] cursor-pointer flex justify-center items-center gap-[5px] py-2 px-4 rounded-md self-end" onClick={()=>router.push(`/cuos/${cuoId}/actividades/${actividadId}/seguimiento-actividad?contratoId=${contratoId}`)}>
                            <FontAwesomeIcon icon={faPlus} className="text-[24px]" />
                            <span>Agregar Seguimiento</span>
                        </button>
                        </>
                    )}
                </div>
                <BackButton color="darkBlue" to={`/cuos/${cuoId}/actividades?contratoId=${contratoId}`}/>
            </main>
        </ProtectedRoute>
    )
}