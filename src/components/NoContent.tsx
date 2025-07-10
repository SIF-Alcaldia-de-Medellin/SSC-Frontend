import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NoContent({element = ''}) {
    return (
        <div className='flex flex-col justify-center items-center bg-white rounded-2xl p-[20px] w-[85%] gap-[20px] my-2.5'>
            <FontAwesomeIcon icon={faTriangleExclamation} className='text-[100px] text-gray-500' />
            <h3 className='text-[24px] font-semibold text-center text-gray-500'>Ups! No se encontraron {element}s</h3>
        </div>
    )
}