import { useState, useEffect } from 'react';
import { Contrato, contratoService } from '@/services/contratosService';

export const useContratoInfo = (id: number | null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contrato, setContrato] = useState<Contrato | null>(null);

    useEffect(() => {
        const loadContrato = async () => {
            setLoading(true);
            try { 
                const contrato = await contratoService.getContratoById(id);
                setContrato(contrato);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar la información del contrato';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false)
            }
        };

        loadContrato();
    }, []);

    return { loading, error, contrato };
};