"use client";
import Image from "next/image";
import logo from "@/assets/logo-distrito-de-medellin.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const { user, logout } = useAuth();
    return (
        <header className="w-full h-[110px] bg-[#004884] flex items-center justify-between px-[100px] sticky top-0 z-50">
            <div className="flex items-center gap-[10px] py-[20px]">
                <Image src={logo} alt="Logo" width={140} height={90} />
                <hr className="w-[5px] min-h-[90px] bg-gray-200 "></hr>
                <strong className="text-white text-[85px] font-extrabold">SIF</strong>
            </div>
            <div className="flex flex-col gap-[10px] text-white items-end">
                <p className="text-[20px]">Bienvenido, <span className="font-bold">{user?.nombre}</span></p>
                <button className="bg-red-500 text-white px-[10px] py-[5px] rounded-[5px] flex items-center gap-[10px] justify-center hover:bg-red-700 transition-all duration-300 text-center cursor-pointer rounded-full w-fit" onClick={logout}>
                    Cerrar sesión
                    <FontAwesomeIcon icon={faSignOut} className="text-[16px]"/>
                </button>
            </div>
        </header>
    )
}