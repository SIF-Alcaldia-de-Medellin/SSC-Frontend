"use client";
import { useParams, useSearchParams } from "next/navigation";
import sscData from "@/services/mocks/data";
import Card from "@/components/Card";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

const { actividades } = sscData;

export default function SeguimientoActividadActividadesPage() {
    const router = useRouter();
    const { id: cuoId } = useParams();

    const actividadesCuo = actividades.filter((actividad) => actividad.cuoId === Number(cuoId));
    /* const handleSelectCuo = (cuo: any) => {
        router.push(`/segumiento-actividad/cuos/${cuo.id}/actividades`);
    } */

    return (
        <ProtectedRoute>
            <Header />
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px]'>
                    <h1 className='text-[48.8px] font-bold text-center'>
                        ¿Que <span className='text-[#AE3E97]'>Actividad</span> deseas realizarle seguimiento?
                    </h1>
                    {Math.random() > 0.5 ? 
                        (<>
                        <LoadingSpinner hexColor="AE3E97"/>
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                        </>) 
                        : 
                        <div className='flex flex-wrap gap-[20px] justify-center items-center w-full'>
                            {actividadesCuo.map((actividad, index) => (
                                <Card 
                                    className={"w-[calc(1/3*100%-20px)] " + (index % 2 == 0 ? 'bg-[#0091C7]' : 'bg-[#42A9FF]')} 
                                    key={actividad.id} 
                                    title={`${actividad.actividad}`} 
                                    subtitle={actividad.unidadesAvance} 
                                >
                                    <div className='flex flex-col gap-[5px] self-end items-end'>
                                        <button className='bg-[#AE3E97] hover:bg-[#91347E] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer'>Seleccionar</button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    }
                    
                </div>
            </main>
        </ProtectedRoute>
    )
}