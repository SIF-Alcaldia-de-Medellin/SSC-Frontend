import { apiClient } from "./api";
import { Cuo  } from "@/types/cuo";

export const cuoService = {
    async getCuosByContratoId(id: number): Promise<Cuo[]>{
        return apiClient.get(`/cuo/contrato/${id}`)
    },
};