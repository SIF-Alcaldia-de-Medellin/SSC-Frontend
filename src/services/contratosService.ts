import { apiClient } from './api';
import { SeguimientoGeneral } from '@/types/seguimiento_general';
import { Contrato } from '@/types/contrato';
import { Adicion } from '@/types/adicion';
import { Modificacion } from '@/types/modificacion';

export interface SeguimientoGeneralForm{
    contratoId: number;
    avanceFinanciero: number;
    avanceFisico: number;
    observaciones: string;
}

export interface AdicionForm{
    contratoId: number;
    valorAdicion: number;
    fecha: string;
    observaciones: string;
}

export interface ModificacionForm{
    contratoId: number;
    tipo: string;
    fechaInicio: string;
    fechaFinal: string;
    observaciones: string;
}

export const contratoService = {
    async getContratos(): Promise<Contrato[]>{
        return apiClient.get('/contratos')
    },
    async getContratoById(id: number): Promise<Contrato>{
        return apiClient.get(`/contratos/${id}`)
    },
    async getAdicionesByContratoId(id: number): Promise<Adicion[]>{
        return apiClient.get(`/adiciones/contrato/${id}`)
    },
    async getModificacionesByContratoId(id: number): Promise<Modificacion[]>{
        return apiClient.get(`/modificaciones/contrato/${id}`)
    },
    async getSeguimientosGeneralesByContratoId(id: number): Promise<SeguimientoGeneral[]>{
        return apiClient.get(`/seguimiento-general/contrato/${id}`)
    },
    async uploadSeguimientoGeneral(seguimiento: SeguimientoGeneralForm): Promise<SeguimientoGeneral>{
        return apiClient.post('/seguimiento-general', seguimiento)
    },
    async uploadAdicion(adicion: AdicionForm): Promise<Adicion>{
        return apiClient.post('/adiciones', adicion)
    },
    async uploadModificacion(modificacion: ModificacionForm): Promise<Modificacion>{
        return apiClient.post('/modificaciones', modificacion)
    }
};