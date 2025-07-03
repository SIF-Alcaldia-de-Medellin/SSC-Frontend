import { useState, useEffect } from 'react';
import { Contrato, contratoService } from '@/services/contratosService';

export const useContratos = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contratos, setContratos] = useState<Contrato[] | null>(null);

    useEffect(() => {
        const loadContratos = async () => {
            setLoading(true);
            try { 
                const contratos = await contratoService.getContratos();
                setContratos(contratos);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los contratos';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false)
            }
        };

        loadContratos();
    }, []);

    return { loading, error, contratos };
};