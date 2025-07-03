import { apiClient } from './api';

export interface Contrato {
    id: number;
    usuarioCedula: string;
    numeroContrato: string;
    anoSuscripcion: number;
    programa: string;
    tipoContrato: string;
    objeto: string;
    identificadorSimple: string;
    suplentes: string | null;
    apoyo: string | null;
    estado: string;
    contratista: string;
    numeroProceso: string;
    fechaInicio: string;
    fechaTerminacionInicial: string;
    fechaTerminacionActual: string;
    valorInicial: string;
    valorTotal: string;
    supervisor: {
      cedula: string;
      nombre: string;
      email: string;
    }
}

export const contratoService = {
    async getContratos(): Promise<Contrato[]>{
        return apiClient.get('/contratos')
    },
    async getContratoById(id: number): Promise<Contrato>{
        return apiClient.get(`/contratos/${id}`)
    }
};