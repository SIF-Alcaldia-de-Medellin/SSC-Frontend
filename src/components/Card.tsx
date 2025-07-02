interface CardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
}

export default function Card({ title, subtitle, children, className }: CardProps) {
    return (
        <div className={`flex flex-col gap-[5px] p-[20px] rounded-2xl h-full text-white hover:scale-105 transition-all duration-300 ${className}`}>
            <h2 className='text-[31.3px] font-bold'>{title}</h2>
            <h4 className='text-[25px] font-semibold'>{subtitle}</h4>
            {children}
        </div>
    )
}