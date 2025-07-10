"use client";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSeguimientoGeneral } from "@/hooks/useSeguimientoGeneral";
import { formatCurrency } from "@/utils/formatCurrency";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifier } from "@/context/NotifierContext";

interface ErrorInputType {
    avanceFisico?: string, 
    avanceFinanciero?: string, 
    observaciones?: string,
} 

export default function SeguimientoGeneralFormularioPage() {
    const { id: contratoId } = useParams();
    const router = useRouter();
    const { logout } = useAuth();
    const { setNotification } = useNotifier();
    const { loading, error, seguimientoGeneral, uploadSeguimientoGeneral } = useSeguimientoGeneral(Number(contratoId));

    const [formData, setFormData] = useState({
        contratoId: Number(contratoId),
        avanceFisico: 0,
        avanceFinanciero: 0,
        observaciones: '',
    });
    const [errorInput, setErrorInput] = useState<ErrorInputType | null>({});

    const displayInput = {
        avanceFisico: 'El avance físico',
        avanceFinanciero: 'El avance financiero',
        observaciones: 'Las observaciones',
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
            await uploadSeguimientoGeneral(formData);
            setNotification({ message: 'Seguimiento general cargado correctamente', type: 'success' });
            router.push(`/contratos/${contratoId}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar el seguimiento general del contrato';
            console.log('Error: ', errorMessage);
        }
    }
    
    const cancelSeguimiento = () => {
        router.push(`/contratos/${contratoId}`);
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
            <main className='flex justify-center items-center min-h-[calc(100dvh-110px)]'>
                <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-2.5'>
                    <div>
                        <h1 className='text-[48.8px] font-bold text-center'>
                            Seguimiento General del Contrato
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
                                Contrato #{seguimientoGeneral?.contrato && 'numeroContrato' in seguimientoGeneral.contrato ? seguimientoGeneral.contrato.numeroContrato : ''}
                            </h2>
                        </div>
                        <form className='flex flex-col gap-[40px]' onSubmit={handleSubmit}>
                            <div className='flex flex-row gap-[20px] items-center justify-center'>
                                <div className='flex flex-col gap-[10px] items-center justify-center max-w-[45%]'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <h3 className='text-[31.3px] font-semibold text-center text-wrap max-w-[80%] text-[#00783F]'>Total de dinero ejecutado:</h3>
                                        <h2 className='text-[48.8px] font-bold text-center text-wrap text-[#00904C]'>{formatCurrency(Number(seguimientoGeneral?.valorEjecutado?.toFixed(0)) || 0)}</h2>
                                    </div>
                                    <label htmlFor="avanceFinanciero" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Coste aproximado de ejecución</label>
                                    <input type="number" id="avanceFinanciero" name="avanceFinanciero" className='border border-gray-300 rounded-md p-1 text-center focus:outline-[#00904C]' placeholder={formatCurrency(Number(seguimientoGeneral?.valorEjecutado?.toFixed(0)) || 0)} onChange={handleChange} />
                                    {errorInput?.avanceFinanciero && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.avanceFinanciero}</p>}
                                </div>
                                <hr className='w-[5px] min-h-[300px] bg-gray-300 border-gray-300' />
                                <div className='flex flex-col gap-[10px] items-center justify-center max-w-[45%]'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <h3 className='text-[31.3px] font-semibold text-center text-wrap max-w-[80%] text-[#D76E00]'>Avance Fisico
                                        Acumulado:</h3>
                                        <h2 className='flex flex-row items-center justify-center text-[48.8px] font-bold text-center text-wrap text-[#FF8403] gap-[10px]'>{seguimientoGeneral?.avanceFisico || 0}<span className='flex items-center justify-center text-[20px] font-semibold text-center text-wrap max-w-[40%] text-wrap'>%</span></h2>
                                    </div>
                                    <label htmlFor="avanceFisico" className='text-[20px] font-semibold font-bold text-center text-wrap'><span className="text-[#F80000]">*</span>Avance Físico</label>
                                    <input type="number" id="avanceFisico" name="avanceFisico" max={100} className='border border-gray-300 rounded-md p-1 text-center focus:outline-[#FF8403]' placeholder={`${seguimientoGeneral?.avanceFisico || 0}%`} onChange={handleChange} />
                                    {errorInput?.avanceFisico && <p className='text-[#F80000] text-[16px] italic text-center text-wrap max-w-[90%]'>{errorInput?.avanceFisico}</p>}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="observaciones" className='text-[20px] font-semibold font-bold text-wrap'><span className="text-[#F80000]">*</span>Observaciones</label>
                                {errorInput?.observaciones && <p className='text-[#F80000] text-[16px] text-wrap italic'>{errorInput?.observaciones}</p>}
                                <textarea id="observaciones" name="observaciones" rows={4} className='border border-gray-300 rounded-md p-1 focus:outline-[#3366CC]' onChange={handleChange}/>
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