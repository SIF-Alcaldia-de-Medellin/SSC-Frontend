import { useState, useEffect } from 'react';
import { Actividad } from '@/types/actividad';
import { actividadesService } from '@/services/actividadesService';

export const useActividades = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actividades, setActividades] = useState<Actividad[] | null>(null);

    useEffect(() => {
        const loadActividades = async () => {
            setLoading(true);
            try { 
                const actividades = await actividadesService.getActividadesByCuoId(id);
                setActividades(actividades);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los cuos asociados al contrato';
                setError(errorMessage);
            } finally {
                setLoading(false)
            }
        };

        loadActividades();
    }, [id]);

    return { loading, error, actividades };
};