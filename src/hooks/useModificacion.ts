import { useState } from 'react';
import { ModificacionForm, contratoService } from '@/services/contratosService';

export const useModificacion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadModificacion = async (modificacionData: ModificacionForm) => {
        setLoading(true);
        try {
            await contratoService.uploadModificacion(modificacionData);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar la modificación';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, uploadModificacion };
};
