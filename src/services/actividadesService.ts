import { apiClient } from "./api";

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

export interface SeguimientoActividad {
    id?: number,
    actividadId?: number,
    avanceFisico?: number,
    costoAproximado?: number,
    createdAt?: string,
    descripcionSeguimiento?: string,
    proyeccionActividades?: string,
    actividad: Actividad | ActividadSummary,
    avanceAcumulado?: number,
    costoAcumulado?: number,
    porcentajeAvance?: number,
    porcentajeEjecucionFinanciera?: number
}

export interface SeguimientoActividadForm {
    actividadId: number,
    avanceFisico: number,
    costoAproximado: number,
    descripcionSeguimiento: string,
    proyeccionActividades: string,
}

export const actividadesService = {
    async getActividadesByCuoId(id: number): Promise<Actividad[]>{
        return apiClient.get(`/actividades/cuo/${id}`)
    },
    async getSeguimientosActividadByActividadId(id: number): Promise<SeguimientoActividad[]>{
        return apiClient.get(`/seguimiento-actividad/actividad/${id}`)
    },
    async getActividadById(id: number): Promise<Actividad>{
        return apiClient.get(`/actividades/${id}`)
    },
    async uploadSeguimientoActividad(seguimiento: SeguimientoActividadForm): Promise<SeguimientoActividad>{
        return apiClient.post(`/seguimiento-actividad`, seguimiento)
    },
};