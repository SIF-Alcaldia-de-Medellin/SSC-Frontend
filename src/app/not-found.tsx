"use client";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <ProtectedRoute>
            <Header />
            <main className='
                flex 
                justify-center 
                items-center 
                min-h-[calc(100dvh-110px)]
            '>
                <div className='
                    flex 
                    flex-col 
                    justify-center 
                    items-center 
                    bg-white 
                    rounded-2xl 
                    p-[50px] 
                    w-[85%] 
                    gap-[20px]
                '>
                    <FontAwesomeIcon icon={faExclamationTriangle} className='text-[100px] text-gray-500' />
                    <h1 className='text-[25px] font-bold text-center'>
                        <span className='text-gray-500'>Ups, parece que esta página no existe...</span>
                    </h1>
                    <button className='text-[20px] font-semibold text-center bg-[#3366CC] hover:bg-[#2A55AA] transition-all duration-300 text-white px-[20px] py-[10px] rounded-full w-fit cursor-pointer' onClick={() => router.push('/')}>
                        Volver al inicio
                    </button>
                </div>
            </main>
        </ProtectedRoute>
    )
}