import { apiClient } from "./api";

export interface Cuo {
    id: number,
    contratoId: number,
    numero: string,
    latitud: string,
    longitud: string,
    comuna: string,
    barrio: string,
    descripcion: string,
    contrato: {
      numeroContrato: string,
      identificadorSimple: string,
      objeto: string
    },
    cantidadActividades: number,
}

export const cuoService = {
    async getCuosByContratoId(id: number): Promise<Cuo[]>{
        return apiClient.get(`/cuo/contrato/${id}`)
    },
};