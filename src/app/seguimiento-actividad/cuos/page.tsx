"use client";
import { useSearchParams } from "next/navigation";
import sscData from "@/services/mocks/data";
import Card from "@/components/Card";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

const { cuos } = sscData;

export default function SeguimientoActividadCuosPage() {
    const searchParams = useSearchParams()
    const router = useRouter();
    const contratoId = searchParams.get('contratoId')

    const handleSelectCuo = (cuo: any) => {
        router.push(`/seguimiento-actividad/cuos/${cuo.id}/actividades`);
      }

    return (
        <ProtectedRoute>
            <Header />
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px]'>
                <h1 className='text-[48.8px] font-bold text-center'>
                    ¿Que <span className='text-[#FF8403]'>Frente de Obra</span> deseas realizarle seguimiento?
                </h1>
                {Math.random() > 0.5 ? 
                    (<>
                    <LoadingSpinner hexColor="FF8403" />
                    <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                    </>) 
                    : 
                    <div className='flex flex-wrap gap-[20px] justify-center items-center w-full'>
                        {cuos.map((cuo, index) => (
                            <Card 
                                className={"max-w-[calc(1/3*100%-20px)] min-h-[250px] " + (index % 2 == 0 ? 'bg-[#006AC3]' : 'bg-[#00AEEF]')} 
                                key={cuo.id} 
                                title={`CUO #${cuo.numero}`} 
                                subtitle={cuo.comuna} 
                            >
                                <p className='text-[16px] font-normal text-wrap'>{cuo.descripcion}</p>
                                <div className='flex flex-col gap-[5px] self-end items-end'>
                                    <h6 className='text-white text-[20px] w-fit font-semibold'>
                                        Total Actividades: {cuo.cantidadActividades}
                                    </h6>
                                    <button className='bg-[#FF8403] hover:bg-[#D76E00] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={() => handleSelectCuo(cuo)}>Seleccionar</button>
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