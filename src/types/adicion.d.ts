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