"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import { useNotifier } from "@/context/NotifierContext";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UpdatePasswordPage(){
    const [formData, setFormData] = useState({ newPassword: '' });
    const {setNotification} = useNotifier();
    const router = useRouter();
    const [loadingPage, setLoadingPage] = useState(true);
    const {loading, error, uploadPasswordFirstTime} = useUpdatePassword();
    const { user } = useAuth();

    useEffect(()=>{
        if(!user?.mustChangePassword) router.push("/");
        setTimeout(() => setLoadingPage(false), 1000);
    },[])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
            setFormData(prev => ({
            ...prev,
            [name]: value
        }));
  };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try{
            await uploadPasswordFirstTime(formData);
            setNotification({ message: 'Contraseña cambiada correctamente', type: 'success' });
            router.push(`/`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar la adición';
            console.log('Error: ', errorMessage);
        }
    };

    useEffect(() => {
        if(!!error) setNotification({ message: error, type: 'error' });
    }, [error, setNotification]);

    return (
    <ProtectedRoute>
        <main className='
            flex 
            justify-center 
            items-center 
            min-h-[calc(100dvh)]
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
                w-fit 
                gap-[20px]
            '>
                {loadingPage ?
                    <div className="flex flex-col gap-[5px] w-[55dvw] items-center">
                        <LoadingSpinner hexColor={""} className="fill-[#3366CC]" />
                        <p className='text-[20px] font-semibold text-center'>Cargando...</p>
                    </div>
                :
                (<>
                <div className="bg-[#FF8403] rounded-md max-w-[55dvw] text-white flex flex-col items-center p-2 text-center">
                    <FontAwesomeIcon icon={faWarning} className="text-[64px]" />
                    <h1 className="font-semibold text-[24px]">Se requiere de un cambio de contraseña debido a que es su primer inicio de sesión.</h1>
                </div>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <label htmlFor="newPassword"><span className="text-red-500">*</span>Nueva contraseña</label>
                    <input type="password" name="newPassword" id="newPassword" className="h-[40px] text-center text-[16px] font-medium border border-gray-300 rounded-md shadow-sm placeholder-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300 w-[250px]" required minLength={8} onChange={handleInputChange}/>
                    {loading ? 
                        <button
                            type="submit"
                            className="bg-[#3366CC] hover:bg-[#2A55AA] hover:scale-105 transition-all duration-300 cursor-pointer text-white rounded-full w-fit min-w-[128.05px] self-center py-2"
                        >
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </button> : 
                        <button type="submit" className="bg-[#3366CC] hover:bg-[#2A55AA] py-2 px-4 rounded-full w-fit self-center text-white font-semibold cursor-pointer">Cambiar contraseña</button>
                    }
                </form>
                </>)}
            </div>
        </main>
    </ProtectedRoute>);
}