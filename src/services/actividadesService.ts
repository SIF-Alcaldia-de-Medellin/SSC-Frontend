import { apiClient } from "./api";
import { Actividad } from "@/types/actividad";
import { SeguimientoActividad } from "@/types/seguimiento_actividad";

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