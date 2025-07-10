import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function BackButton({color = 'purple', to = '/'}) {  
    const router = useRouter();

    const colors: { 
        [key: string]: { 
            backgroundColor: string; 
            hoverColor: string; 
            textColor: string 
        } 
    } = {
        purple: {
            backgroundColor: '#AE3E97',
            hoverColor: '#91347E',
            textColor: 'white',
        },
        orange: {
            backgroundColor: '#FF8403',
            hoverColor: '#FF6B00',
            textColor: 'white',
        }
    };

    return (
        <button
            className={`
                group
                fixed bottom-[20px] left-[40px]
                flex items-center justify-evenly hover:gap-2
                bg-[${colors[color].backgroundColor}]
                hover:bg-[${colors[color].hoverColor}]
                text-${colors[color].textColor}
                p-[10px]
                rounded-full
                cursor-pointer font-semibold
                transition-colors duration-300
                w-fit
            `}
            onClick={() => router.push(to)}
            >
            <FontAwesomeIcon icon={faArrowLeft} width={20} height={20} />
            <span
                className="
                transition-all duration-300
                max-w-0 group-hover:max-w-[100px]
                opacity-0 group-hover:opacity-100
                overflow-hidden
                whitespace-nowrap
                hidden
                "
                style={{ display: 'inline-block' }}
            >
                Volver
            </span>
        </button>
    )
}
