"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle, faCheckCircle } from "@fortawesome/free-regular-svg-icons" 
import { useEffect, useState } from "react";
import { useNotifier } from "@/context/NotifierContext";

export default function Notification() {
    const { notification, setNotification } = useNotifier();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        console.log(notification);
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        const clearNotification = setTimeout(() => {
            setNotification(null);
        }, 10000);

        return () => {
            clearTimeout(timer);
            clearTimeout(clearNotification);
        };
    }, [notification, setNotification]);
    
    return (
        (notification && (
            <div
                className={`fixed bottom-2 right-2 max-w-[500px] w-fit h-[150px] bg-opacity-50 flex justify-center items-center z-50 rounded-2xl transition-all duration-1000 ${
                    isVisible ? 'right-2 opacity-100 starting:right-[-300px] starting:opacity-0 transition-all' : 'right-[-300px] opacity-0'
                } ${notification.type === 'success' ? 'bg-[#00904C]' : 'bg-[#F80000]'}`}
            >
                <div className="flex flex-row gap-[20px] items-center justify-evenly w-full p-[20px]">
                    <FontAwesomeIcon icon={notification.type === 'success' ? faCheckCircle : faXmarkCircle} className="text-white text-[64px]" />
                    <p className="text-white font-semibold">{notification.message}</p>
                </div>
            </div>
        ))
    )
}