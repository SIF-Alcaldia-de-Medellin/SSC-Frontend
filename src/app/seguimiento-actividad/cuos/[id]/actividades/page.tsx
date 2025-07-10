"use client";
import { useParams, useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import BackButton from "@/components/BackButton";
import { useActividades } from "@/hooks/useActividades";
import { useNotifier } from "@/context/NotifierContext";
import { useEffect } from "react";
import NoContent from "@/components/NoContent";
import { useAuth } from "@/context/AuthContext";

export default function SeguimientoActividadActividadesPage() {
    const { id: cuoId } = useParams();
    const searchParams = useSearchParams()
    const contratoId = searchParams.get('contratoId')
    const router = useRouter();
    const { logout } = useAuth();

    const { loading, error, actividades } = useActividades(Number(cuoId));
    const { setNotification } = useNotifier();

    useEffect(() => {
        if(!!error) setNotification({ message: error, type: 'error' });
        if(error?.includes("Unauthorized")) logout();
        if(error?.includes("No se encontró el CUO con ID")) router.push(`/seguimiento-actividad/cuos?contratoId=${contratoId}`);
        if(error?.includes("No tienes acceso a este contrato")) router.push(`/`);
    }, [error, setNotification]);

    return (
        <ProtectedRoute>
            <Header />
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-[20px]'>
                    <h1 className='text-[48.8px] font-bold text-center'>
                        ¿Que <span className='text-[#AE3E97]'>Actividad</span> deseas realizarle seguimiento?
                    </h1>
                    {loading ? 
                        (<>
                        <LoadingSpinner hexColor="AE3E97"/>
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                        </>) 
                        : 
                        <div className='flex flex-wrap gap-[20px] justify-center items-stretch w-full'>
                            {actividades?.map((actividad, index) => (
                                <Card 
                                    className={"justify-evenly w-[calc(1/3*100%-20px)] max-w-[calc(1/3*100%-20px)] min-h-[240px] " + (index % 2 == 0 ? 'bg-[#0091C7]' : 'bg-[#42A9FF]')} 
                                    key={actividad?.id} 
                                    title={`${actividad?.actividad}`} 
                                    subtitle={actividad?.unidadesAvance} 
                                >
                                    <div className='flex flex-col gap-[5px] self-end items-end'>
                                        <button className='bg-[#AE3E97] hover:bg-[#91347E] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={() => router.push(`/seguimiento-actividad/cuos/${cuoId}/actividades/${actividad.id}?contratoId=${contratoId}`)}>Seleccionar</button>
                                    </div>
                                </Card>
                            ))}
                            {actividades?.length === 0 && <NoContent element="actividade" />}
                        </div>
                    }
                </div>
                <BackButton color="purple" to={`/seguimiento-actividad/cuos?contratoId=${contratoId}`}/>
            </main>
        </ProtectedRoute>
    )
}