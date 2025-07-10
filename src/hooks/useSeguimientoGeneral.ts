import { useState, useEffect } from 'react';
import { contratoService, SeguimientoGeneralForm } from '@/services/contratosService';
import { SeguimientoGeneral } from '@/types/seguimiento_general';

export const useSeguimientoGeneral = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [seguimientoGeneral, setSeguimientoGeneral] = useState<SeguimientoGeneral | null>(null);

    const uploadSeguimientoGeneral = async (seguimiento: SeguimientoGeneralForm) => {
        setLoading(true);
        try {
            const seguimientoGeneral = await contratoService.uploadSeguimientoGeneral(seguimiento);
            setSeguimientoGeneral(seguimientoGeneral);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar el seguimiento general del contrato';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadSeguimientoGeneral = async () => {
            setLoading(true);
            try { 
                const seguimientosGenerales = await contratoService.getSeguimientosGeneralesByContratoId(id);
                const seguimientoGeneralData = seguimientosGenerales[0];
                setSeguimientoGeneral(seguimientoGeneralData);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar los seguimientos asociados a la actividad';
                console.log('errorMessage', errorMessage);
                if(!errorMessage.includes("No se encontraron seguimientos")) {
                    setError(errorMessage);
                    throw err;
                }else{
                    const contrato =  await contratoService.getContratoById(id);
                    setSeguimientoGeneral({
                        ...seguimientoGeneral,
                        contrato: contrato
                    });
                }
            } finally {
                setLoading(false)
            }
        };

        loadSeguimientoGeneral();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { loading, error, seguimientoGeneral, uploadSeguimientoGeneral };
};
