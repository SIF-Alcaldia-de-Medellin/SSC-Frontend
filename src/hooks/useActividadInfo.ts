import { useState, useEffect } from 'react';
import { actividadesService, SeguimientoActividadForm } from '@/services/actividadesService';
import { SeguimientoActividad } from '@/types/seguimiento_actividad';

export const useActividadInfo = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [actividadInfoSeguimiento, setActividadInfoSeguimiento] = useState<SeguimientoActividad | null>(null);
    const [error, setError] = useState<string | null>(null);

    const uploadSeguimientoActividad = async (seguimiento: SeguimientoActividadForm) => {
        setLoading(true);
        try {
            const seguimientoActividad = await actividadesService.uploadSeguimientoActividad(seguimiento);
            setActividadInfoSeguimiento(seguimientoActividad);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los seguimientos asociados a la actividad';
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadDataSeguimientoActividad = async () => {
            setLoading(true);
            try { 
                const actividadInfoSeguimientos = await actividadesService.getSeguimientosActividadByActividadId(id);
                const actividadInfoSeguimientoData = actividadInfoSeguimientos[0];
                setActividadInfoSeguimiento(actividadInfoSeguimientoData);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los seguimientos asociados a la actividad';
                if(!errorMessage.includes("No se encontraron seguimientos para la actividad")) {
                    setError(errorMessage);
                }else{
                    try {
                        const actividadInfo = await actividadesService.getActividadById(id);
                        setActividadInfoSeguimiento({
                            actividad: actividadInfo,
                        });
                    } catch (subErr: unknown) {
                        const subErrorMessage = subErr instanceof Error ? subErr.message : 'Error al obtener la actividad';
                        setError(subErrorMessage);
                    }
                }
            } finally {
                setLoading(false)
            }
        };

        loadDataSeguimientoActividad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { loading, error, actividadInfoSeguimiento, uploadSeguimientoActividad };
};
