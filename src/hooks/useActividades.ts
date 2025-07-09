import { useState, useEffect } from 'react';
import { Actividad, actividadesService } from '@/services/actividadesService';

export const useActividades = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actividades, setActividades] = useState<Actividad[] | null>(null);

    useEffect(() => {
        const loadCuos = async () => {
            setLoading(true);
            try { 
                const actividades = await actividadesService.getActividadesByCuoId(id);
                setActividades(actividades);
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

    return { loading, error, actividades };
};