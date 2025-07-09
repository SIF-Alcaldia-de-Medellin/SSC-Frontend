import { useState } from 'react';
import { AdicionForm, contratoService } from '@/services/contratosService';

export const useAdicion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadAdicion = async (adicionData: AdicionForm) => {
        setLoading(true);
        try {
            await contratoService.uploadAdicion(adicionData);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los seguimientos asociados a la actividad';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, uploadAdicion };
};
