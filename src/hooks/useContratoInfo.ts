import { useState, useEffect } from 'react';
import { Contrato, contratoService, Modificacion, Adicion, SeguimientoGenral } from '@/services/contratosService';

export const useContratoInfo = (id: number) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contrato, setContrato] = useState<Contrato | null>(null);
    const [adiciones, setAdiciones] = useState<Adicion[] | null>(null);
    const [modificaciones, setModificaciones] = useState<Modificacion[] | null>(null);
    const [seguimientoGeneral, setSeguimientoGeneral] = useState<SeguimientoGenral | null>(null);

    useEffect(() => {
        const loadContrato = async () => {
            setLoading(true);
            try { 
                const contrato = await contratoService.getContratoById(id);
                const modificaciones = await contratoService.getModificacionesByContratoId(id);
                const adiciones = await contratoService.getAdicionesByContratoId(id);

                setContrato(contrato);
                setModificaciones(modificaciones);
                setAdiciones(adiciones);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Ha ocurrido un error al cargar la información del contrato';
                setError(errorMessage);
                throw err;
            }

            try{
                const seguimientosGenerales = await contratoService.getSeguimientosGeneralesByContratoId(id);
                const seguimientoGeneral = await seguimientosGenerales[0];
                setSeguimientoGeneral(seguimientoGeneral);
            } catch (err: unknown) {
                console.log('Error: ',err)
                setSeguimientoGeneral(null);
            }finally{
                setLoading(false);
            }
        };

        loadContrato();
    }, [id]);

    return { loading, error, contrato, modificaciones, adiciones, seguimientoGeneral };
};