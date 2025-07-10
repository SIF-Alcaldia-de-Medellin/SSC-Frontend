"use client";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useModificacion } from "@/hooks/useModificacion";
import { useAuth } from "@/context/AuthContext";
import { useNotifier } from "@/context/NotifierContext";

interface ErrorInputType {
    tipo?: string,
    fechaInicio?: string,
    fechaFinal?: string,
    observaciones?: string,
} 

enum TipoModificacion {
    SUSPENSION = 'SUSPENSION',
    PRORROGA  = 'PRORROGA',
}

export default function SeguimientoGeneralFormularioPage() {
    const { id: contratoId } = useParams();
    const router = useRouter();
    const { loading, error, uploadModificacion } = useModificacion();
    const { logout } = useAuth();
    const { setNotification } = useNotifier();
    const [formData, setFormData] = useState({
        contratoId: Number(contratoId),
        tipo: '',
        fechaInicio: '',
        fechaFinal: '',
        observaciones: '',
    });
    const [errorInput, setErrorInput] = useState<ErrorInputType>({});

    const displayInput = {
        tipo: 'El tipo de modificación',
        fechaInicio: 'La fecha de inicio',
        fechaFinal: 'La fecha de finalización',
        observaciones: 'Las observaciones',
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData({ ...formData, [name]: type == 'number' ? Number(value) : (type == 'date' ? new Date(value).toISOString().split('T')[0] : value) });
        setErrorInput({ ...errorInput, [name]: null });
        if(type == 'number' && value && Number(value) <= 0){
            setErrorInput({ ...errorInput, [name]: `${displayInput[name as keyof typeof displayInput]} no puede ser menor o igual a 0` });
        }
    }

    const validateForm = () => {
        const errors: ErrorInputType = {};
        for(const key in formData){
            if(formData[key as keyof typeof formData] == null || formData[key as keyof typeof formData] == ''){
                errors[key as keyof ErrorInputType] = `${displayInput[key as keyof typeof displayInput]} es requerido`;
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
        console.log(formData);
        if(validateForm()) return;
        try{
            await uploadModificacion(formData);
            setNotification({ message: 'Modificación cargada correctamente', type: 'success' });
            router.push(`/contratos/${contratoId}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar la adición';
            console.log('Error: ', errorMessage);
        }
    }
    
    const cancelAdicion = () => {
        router.push(`/contratos/${contratoId}`);
    }

    useEffect(() => {
        if(!!error) setNotification({ message: error, type: 'error' }); 
        if(error?.includes("Unauthorized")) logout();
        if(error?.includes("No tienes acceso a este contrato")) router.push(`/`);
    }, [error, setNotification]);

    return (
        <ProtectedRoute>
            <Header />
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-2.5'>
                    <div>
                        <h1 className='text-[48.8px] font-bold text-center'>
                            Agregar modificación
                        </h1>
                    </div>
                    {loading ? (
                        <>
                        <div className='flex items-center justify-center'><LoadingSpinner hexColor='00904C' className='fill-[#3366CC]' /></div>
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                        </>
                    ) : (
                        <>
                        <form className='flex flex-col gap-[20px] w-[60%]' onSubmit={handleSubmit}>
                            <div className='flex flex-row gap-[20px] items-center justify-center w-full'>
                                <div className='flex flex-col gap-[10px] items-center justify-center w-1/3'>
                                    <label htmlFor="tipo" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Tipo de modificación</label>
                                    <select name="tipo" id="tipo" className='w-full border border-gray-300 rounded-md p-1 text-center focus:outline-[#3366CC]' onChange={handleChange} defaultValue={"default"}>
                                        <option value="default" key="default" disabled hidden>Seleccionar tipo</option>
                                        {Object.values(TipoModificacion).map((tipo) => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                    {errorInput?.tipo && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.tipo}</p>}
                                </div>
                                <hr className='w-[5px] min-h-[225px] bg-gray-300 border-gray-300' />
                                <div className='flex flex-col gap-[25px] items-center justify-between w-1/3'>
                                    <div className='flex flex-col gap-[5px] items-center justify-center w-full'>
                                        <label htmlFor="fechaInicio" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Fecha de inicio</label>
                                        <input type="date" id="fechaInicio" name="fechaInicio" className='w-full border border-gray-300 rounded-md p-1 text-center focus:outline-[#3366CC]' placeholder={new Date(Date.now()).toISOString().split('T')[0]} 
                                        onChange={handleChange} />
                                        {errorInput?.fechaInicio && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.fechaInicio}</p>}
                                    </div>
                                    <div className='flex flex-col gap-[5px] items-center justify-center w-full'>
                                        <label htmlFor="fechaFinal" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Fecha de finalización</label>
                                        <input type="date" id="fechaFinal" name="fechaFinal" className='w-full border border-gray-300 rounded-md p-1 text-center focus:outline-[#3366CC]' placeholder={new Date(Date.now()).toISOString().split('T')[0]} min={formData.fechaInicio}
                                        onChange={handleChange} />
                                        {errorInput?.fechaFinal && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.fechaFinal}</p>}
                                    </div>
                                </div>
                                <hr className='w-[5px] min-h-[225px] bg-gray-300 border-gray-300' />
                                <div className='flex flex-col gap-[10px] items-center justify-center w-1/4'>
                                    <h3 className='text-[20px] font-semibold text-[#91347E]'>Duración</h3>
                                    <div className="flex flex-row gap-[5px] items-center justify-center text-[#AE3E97]">
                                        <h2 className='text-[48.8px] font-bold text-center'>{Math.ceil((new Date(formData.fechaFinal).getTime() - new Date(formData.fechaInicio).getTime()) / (1000 * 60 * 60 * 24) + 1) || 0}</h2><span className="text-[20px] font-semibold">dias</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="observaciones" className='text-[20px] font-semibold font-bold text-wrap'><span className="text-[#F80000]">*</span>Observaciones</label>
                                {errorInput?.observaciones && <p className='text-[#F80000] text-[16px] text-wrap italic'>{errorInput?.observaciones}</p>}
                                <textarea id="observaciones" name="observaciones" rows={4} className='border border-gray-300 rounded-md p-1 focus:outline-[#3366CC]' onChange={handleChange}/>
                            </div>
                            <div className='flex flex-row gap-[20px] items-center justify-center'>
                                <button className='bg-[#F80000] hover:bg-[#CF0000] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={cancelAdicion} type="button">Cancelar</button>
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