import { useState, useEffect } from 'react';
import { Cuo, cuoService } from '@/services/cuosService';

export const useCuos = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cuos, setCuos] = useState<Cuo[] | null>(null);

    useEffect(() => {
        const loadCuos = async () => {
            setLoading(true);
            try { 
                const cuos = await cuoService.getCuosByContratoId(id);
                setCuos(cuos);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los cuos asociados al contrato';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false)
            }
        };

        loadCuos();
    }, [id]);

    return { loading, error, cuos };
};