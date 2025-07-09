export interface SeguimientoGeneral{
    id?: number;
    contratoId?: number;
    contrato?: {
        numeroContrato: string;
        identificadorSimple: string;
        objeto: string;
        valorTotal: number;
        fechaTerminacionActual: string;
        estado: string;
    } | Contrato,
    valorEjecutadoIndividual?: number;
    valorEjecutado?: number;
    avanceFinanciero?: number;
    avanceFisicoIndividual?: number;
    avanceFisico?: number;
    createdAt?: string;
    fechaUltimaModificacion?: string;
    observaciones?: string;
    diferenciaAvance?: number;
    estadoAvance?: string;
    resumenEstado?: string;
}
