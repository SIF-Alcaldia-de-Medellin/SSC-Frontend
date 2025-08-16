"use client";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatCurrency } from "@/utils/formatCurrency";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdicion } from "@/hooks/useAdicion";
import { useNotifier } from "@/context/NotifierContext";
import { useAuth } from "@/context/AuthContext";

interface ErrorInputType {
    valorAdicion?: string, 
    fecha?: string, 
    observaciones?: string,
} 

export default function SeguimientoGeneralFormularioPage() {
    const { id: contratoId } = useParams();
    const router = useRouter();
    const { loading, error, uploadAdicion } = useAdicion();
    const { logout } = useAuth();
    const { setNotification } = useNotifier();
    const [formData, setFormData] = useState({
        contratoId: Number(contratoId),
        valorAdicion: 0, 
        fecha: '', 
        observaciones: '',
    });
    const [errorInput, setErrorInput] = useState<ErrorInputType>({});

    const displayInput = {
        valorAdicion: 'El valor de la adición',
        fecha: 'La fecha',
        observaciones: 'Las observaciones',
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        if(validateForm()) return;
        try{
            await uploadAdicion(formData);
            setNotification({ message: 'Adición cargada correctamente', type: 'success' });
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
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-[20px]'>
                    <div>
                        <h1 className='text-[48.8px] font-bold text-center'>
                            Agregar adición
                        </h1>
                    </div>
                    {loading ? (
                        <>
                        <div className='flex items-center justify-center'><LoadingSpinner hexColor='00904C' className='fill-[#3366CC]' /></div>
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                        </>
                    ) : (
                        <>
                        <form className='flex flex-col gap-[20px]' onSubmit={handleSubmit}>
                            <div className='flex flex-row gap-[20px] items-center justify-center'>
                                <div className='flex flex-col gap-[10px] items-center justify-center max-w-[45%]'>
                                    <label htmlFor="fecha" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Fecha de la adición</label>
                                    <input type="date" id="fecha" name="fecha" className='w-full border border-gray-300 rounded-md p-1 text-center focus:outline-[#3366CC]' placeholder={new Date(Date.now()).toISOString().split('T')[0]} 
                                    onChange={handleChange} />
                                    {errorInput?.fecha && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.fecha}</p>}
                                </div>
                                <hr className='w-[5px] min-h-[100px] bg-gray-300 border-gray-300' />
                                <div className='flex flex-col gap-[10px] items-center justify-center max-w-[45%]'>
                                    <label htmlFor="valorAdicion" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Valor de la adición</label>
                                    <input type="number" id="valorAdicion" name="valorAdicion"  className='w-full border border-gray-300 rounded-md p-1 text-center focus:outline-[#3366CC]' placeholder={formatCurrency(1000000)} onChange={handleChange} />
                                    {errorInput?.valorAdicion && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.valorAdicion}</p>}
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