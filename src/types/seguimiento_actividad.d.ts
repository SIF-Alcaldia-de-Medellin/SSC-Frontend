import { Actividad, ActividadSummary } from "./actividad";

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