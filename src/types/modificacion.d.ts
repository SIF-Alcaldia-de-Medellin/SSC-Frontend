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