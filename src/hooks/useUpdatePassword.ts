import { useState } from 'react';
import { authService } from '@/services/authService';

export const useUpdatePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadPasswordFirstTime = async (body: {newPassword: string}) => {
        setLoading(true);
        try {
            await authService.updatePasswordFirstTime(body);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar la modificación';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, uploadPasswordFirstTime };
};
