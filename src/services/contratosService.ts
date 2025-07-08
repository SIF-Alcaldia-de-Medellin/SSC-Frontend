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

export interface Adicion {
    id: number;
    contratoId: number;
    contrato: {
      numeroContrato: string;
      identificadorSimple: string;
      objeto: string;
      valorTotal: string;
    };
    valorAdicion: number;
    fecha: string;
    createdAt: string;
    observaciones: string;
}

export interface Modificacion {
    id: number;
    contratoId: number;
    tipo: string;
    fechaInicio: string;
    fechaFinal: string;
    duracion: number;
    createdAt: string;
    observaciones: string;
    contrato: {
      numeroContrato: string;
      identificadorSimple: string;
      objeto: string;
      fechaTerminacionActual: string;
    }
}

export interface SeguimientoGenral{
    id: number;
    contratoId: number;
    contrato: {
      numeroContrato: string;
      identificadorSimple: string;
      objeto: string;
      valorTotal: number;
      fechaTerminacionActual: string;
      estado: string;
    },
    valorEjecutadoIndividual: number;
    valorEjecutado: number;
    avanceFinanciero: number;
    avanceFisicoIndividual: number;
    avanceFisico: number;
    createdAt: string;
    fechaUltimaModificacion: string;
    observaciones: string;
    diferenciaAvance: number;
    estadoAvance: string;
    resumenEstado: string;
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
    async getSeguimeintosGeneralesByContratoId(id: number): Promise<SeguimientoGenral[]>{
        return apiClient.get(`/seguimiento-general/contrato/${id}`)
    },
};