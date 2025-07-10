"use client";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useActividadInfo } from "@/hooks/useActividadInfo";
import { formatCurrency } from "@/utils/formatCurrency";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotifier } from "@/context/NotifierContext";
import { useAuth } from "@/context/AuthContext";

interface ErrorInputType {
    avanceFisico?: string, 
    costoAproximado?: string, 
    descripcionSeguimiento?: string, 
    proyeccionActividades?: string,
} 

export default function SeguimientoActividadFormularioPage() {
    const { id_actividad: actividadId, id: cuoId } = useParams();
    const searchParams = useSearchParams();
    const contratoId = searchParams.get('contratoId');
    const router = useRouter();
    const { setNotification } = useNotifier();
    const { logout } = useAuth();
    const { loading, error, actividadInfoSeguimiento, uploadSeguimientoActividad } = useActividadInfo(Number(actividadId));

    const [formData, setFormData] = useState({
        actividadId: Number(actividadId),
        avanceFisico: 0,
        costoAproximado: 0,
        descripcionSeguimiento: '',
        proyeccionActividades: ''
    });
    const [errorInput, setErrorInput] = useState<ErrorInputType | null>({});

    const displayInput = {
        avanceFisico: 'El avance físico',
        costoAproximado: 'El costo aproximado',
        descripcionSeguimiento: 'La descripción del seguimiento',
        proyeccionActividades: 'La proyección de actividades',
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData({ ...formData, [name]: type == 'number' ? Number(value) : value });
        setErrorInput({ ...errorInput, [name]: null });
        
        if(type == 'number' && value && Number(value) <= 0){
            setErrorInput({ ...errorInput, [name]: `${displayInput[name as keyof typeof displayInput]} no puede ser menor o igual a 0` });
        }
    }

    const validateForm = () => {
        const errors: ErrorInputType = {};
        for(const key in formData){
            if(formData[key as keyof typeof formData] == null || formData[key as keyof typeof formData] == ''){
                errors[key as keyof ErrorInputType]= `${displayInput[key as keyof typeof displayInput]} es requerido`;
            }
        }

        if(Object.keys(errors).length > 0){
            setErrorInput({
                ...errorInput,
                ...errors
            });
            return true;
        }

        return false;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) return;
        try{
            await uploadSeguimientoActividad(formData);
            setNotification({ message: 'Seguimiento cargado correctamente', type: 'success' });
            router.push(`/contratos/${contratoId}`);
        } catch (err: unknown) {
            console.log(err);
        }
    }
    
    const cancelSeguimiento = () => {
        router.push(`/seguimiento-actividad/cuos/${cuoId}/actividades?contratoId=${contratoId}`);
    }

    useEffect(() => {
        if(!!error) setNotification({ message: error, type: 'error' });
        if(error?.includes("Unauthorized")) logout();
        if(error?.includes("No se encontró la actividad con ID")) router.push(`/seguimiento-actividad/cuos/${cuoId}/actividades?contratoId=${contratoId}`);
        if(error?.includes("No tienes acceso a este contrato")) router.push(`/`);
    }, [error, setNotification]);

    return (
        <ProtectedRoute>
            <Header />
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-2.5'>
                    <div>
                        <h1 className='text-[48.8px] font-bold text-center'>
                            Seguimiento de Avance Físico por Actividad
                        </h1>
                    </div>
                    {loading ? (
                        <>
                        <div className='flex items-center justify-center'><LoadingSpinner hexColor='00904C' className='fill-[#00904C]' /></div>
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                        </>
                    ) : (
                        <>
                        <div>
                            <h2 className='text-[25px] font-bold text-center text-[#3366CC]'>
                                {actividadInfoSeguimiento?.actividad && 'descripcion' in actividadInfoSeguimiento.actividad ? actividadInfoSeguimiento.actividad.descripcion : (actividadInfoSeguimiento?.actividad && 'actividad' in actividadInfoSeguimiento.actividad ? actividadInfoSeguimiento.actividad.actividad : '')}
                            </h2>
                        </div>
                        <form className='flex flex-col gap-[40px]' onSubmit={handleSubmit}>
                            <div className='flex flex-row gap-[20px] items-center justify-center'>
                                <div className='flex flex-col gap-[10px] items-center justify-center max-w-[45%]'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <h3 className='text-[31.3px] font-semibold text-center text-wrap max-w-[80%] text-[#00783F]'>Acumulado de Costos:</h3>
                                        <h2 className='text-[48.8px] font-bold text-center text-wrap text-[#00904C]'>{formatCurrency(actividadInfoSeguimiento?.costoAcumulado || 0)}</h2>
                                    </div>
                                    <label htmlFor="costoAproximado" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Coste aproximado</label>
                                    <input type="number" id="costoAproximado" name="costoAproximado" className='border border-gray-300 rounded-md p-1 text-center focus:outline-[#00904C]' placeholder={formatCurrency(actividadInfoSeguimiento?.costoAproximado || 0)} onChange={handleChange} />
                                    {errorInput?.costoAproximado && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.costoAproximado}</p>}
                                </div>
                                <hr className='w-[5px] min-h-[300px] bg-gray-300 border-gray-300' />
                                <div className='flex flex-col gap-[10px] items-center justify-center max-w-[45%]'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <h3 className='text-[31.3px] font-semibold text-center text-wrap max-w-[80%] text-[#D76E00]'>Avance Fisico
                                        Acumulado:</h3>
                                        <h2 className='flex flex-row items-center justify-center text-[48.8px] font-bold text-center text-wrap text-[#FF8403] gap-[10px]'>{actividadInfoSeguimiento?.avanceAcumulado || 0}<span className='flex items-center justify-center text-[20px] font-semibold text-center text-wrap max-w-[40%] text-wrap'>{actividadInfoSeguimiento?.actividad.unidadesAvance}</span></h2>
                                    </div>
                                    <label htmlFor="avanceFisico" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Avance Físico</label>
                                    <input type="number" id="avanceFisico" name="avanceFisico" className='border border-gray-300 rounded-md p-1 text-center focus:outline-[#FF8403]' placeholder={`${actividadInfoSeguimiento?.avanceAcumulado || 0}${actividadInfoSeguimiento?.actividad.unidadesAvance}`} onChange={handleChange} />
                                    {errorInput?.avanceFisico && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.avanceFisico}</p>}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="descripcionSeguimiento" className='text-[20px] font-semibold font-bold text-wrap'><span className="text-[#F80000]">*</span>Descripción del Seguimiento</label>
                                {errorInput?.descripcionSeguimiento && <p className='text-[#F80000] text-[16px] text-wrap italic'>{errorInput?.descripcionSeguimiento}</p>}
                                <textarea id="descripcionSeguimiento" name="descripcionSeguimiento" rows={4} className='border border-gray-300 rounded-md p-1 focus:outline-[#3366CC]' onChange={handleChange}/>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="proyeccionActividades" className='text-[20px] font-semibold font-bold text-wrap'><span className="text-[#F80000]">*</span>Actividades Proyectadas</label>
                                {errorInput?.proyeccionActividades && <p className='text-[#F80000] text-[16px] text-wrap italic'>{errorInput?.proyeccionActividades}</p>}
                                <textarea id="proyeccionActividades" name="proyeccionActividades" rows={4} className='border border-gray-300 rounded-md p-1 focus:outline-[#3366CC]' onChange={handleChange}/>
                            </div>
                            <div className='flex flex-row gap-[20px] items-center justify-center'>
                                <button className='bg-[#F80000] hover:bg-[#CF0000] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={cancelSeguimiento} type="button">Cancelar</button>
                                <button className='bg-[#00904C] hover:bg-[#00783F] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' type="submit">Guardar</button>
                            </div>
                        </form>
                        </>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    )
}