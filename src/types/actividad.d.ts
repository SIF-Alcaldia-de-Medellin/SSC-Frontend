export interface Actividad {
    id: number,
    cuoId: number,
    actividad: string,
    metaFisica: number,
    proyectadoFinanciero: string,
    unidadesAvance: string,
    cuo: {
        id: number,
        nroCuo: string,
        descripcion: string,
    },
}

export interface ActividadSummary {
    descripcion: string,
    metaFisica?: number,
    unidadesAvance: string,
    proyectadoFinanciero?: number,
    cuoId: number
}