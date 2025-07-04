/**
 * Configuración y funciones de API para conectar con el backend SSC
 */

// Configuración base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ssc-backend-bpfkhpaugdezgjfu.centralus-01.azurewebsites.net';

// Tipos para TypeScript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

interface Usuario {
  cedula: string;
  email: string;
  nombre: string;
  rol: string;
}

interface CreateContratoData {
  usuarioCedula: string;
  numeroContrato: string;
  anoSuscripcion: number;
  programa: string;
  tipoContrato: string;
  objeto: string;
  identificadorSimple: string;
  suplentes?: string;
  apoyo?: string;
  estado: string;
  contratista: string;
  numeroProceso: string;
  fechaInicio: string;
  fechaTerminacionInicial: string;
  fechaTerminacionActual: string;
  valorInicial: number;
  valorTotal: number;
}

interface Contrato {
  id: number;
  numeroContrato: string;
  programa: string;
  tipoContrato: string;
  objeto: string;
  estado: string;
  contratista: string;
  fechaInicio: string;
  fechaTerminacionActual: string;
  valorInicial: number;
  valorTotal: number;
}

interface CUO {
  id: number;
  contratoId: number;
  numero: string;
  latitud: number;
  longitud: number;
  comuna: string;
  barrio: string;
  descripcion: string;
}

interface Actividad {
  id: number;
  cuoId: number;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;
  fechaInicio: string;
  fechaFin: string;
}

interface SeguimientoGeneral {
  id: number;
  contratoId: number;
  avanceFinanciero: number;
  avanceFisico: number;
  observaciones: string;
}

interface SeguimientoActividad {
  id: number;
  actividadId: number;
  avanceFisico: number;
  costoAproximado: number;
  descripcionSeguimiento: string;
  proyeccionActividades: string;
}

interface Modificacion {
  id: number;
  contratoId: number;
  tipo: string;
  fechaInicio: string;
  fechaFinal: string;
  duracion: number;
  observaciones: string;
}

interface Adicion {
  id: number;
  contratoId: number;
  valorAdicion: number;
  fecha: string;
  observaciones: string;
}

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Función helper para realizar peticiones HTTP
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    mode: 'cors',
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let error: ApiError;
      try {
        const errorData = await response.json();
        error = {
          message: errorData.message || errorData.error || `Error ${response.status}`,
          statusCode: response.status,
        };
      } catch {
        error = {
          message: response.statusText || 'Error de conexión',
          statusCode: response.status,
        };
      }
      throw error;
    }

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // Para endpoints que retornan texto o están vacíos
      return {} as T;
    }
  } catch (error) {
    if (error instanceof TypeError) {
      // Error de red o CORS
      throw {
        message: 'Error de conexión con el servidor',
        statusCode: 0,
      } as ApiError;
    }
    throw error;
  }
}

/**
 * Servicios de autenticación
 */
export const authApi = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Extraer información del usuario desde el JWT token
  extractUserFromToken(token: string): Usuario {
    try {
      // Decodificar el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        cedula: payload.sub || '',
        email: payload.email || '',
        nombre: payload.email ? payload.email.split('@')[0] : '',
        rol: payload.rol || 'USER'
      };
    } catch {
      throw new Error('Token inválido');
    }
  },

  // Verificar health del backend
  async healthCheck(): Promise<{ status: string }> {
    return apiRequest<{ status: string }>('/');
  },
};

/**
 * Servicios de contratos (basados en la documentación de Swagger)
 */
export const contratosApi = {
  // Crear un nuevo contrato
  async createContrato(data: Partial<Contrato>): Promise<Contrato> {
    return apiRequest<Contrato>('/contratos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener todos los contratos
  async getContratos(): Promise<Contrato[]> {
    return apiRequest<Contrato[]>('/contratos');
  },

  // Obtener un contrato por ID
  async getContrato(id: number): Promise<Contrato> {
    return apiRequest<Contrato>(`/contratos/${id}`);
  },

  // Actualizar un contrato
  async updateContrato(id: number, data: Partial<Contrato>): Promise<Contrato> {
    return apiRequest<Contrato>(`/contratos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Eliminar un contrato
  async deleteContrato(id: number): Promise<void> {
    return apiRequest<void>(`/contratos/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener contratos por supervisor (cédula)
  async getContratosBySupervisor(cedula: string): Promise<Contrato[]> {
    return apiRequest<Contrato[]>(`/contratos/supervisor/${cedula}`);
  },

  // Obtener un contrato por número
  async getContratoByNumero(numeroContrato: string): Promise<Contrato> {
    return apiRequest<Contrato>(`/contratos/numero/${numeroContrato}`);
  },
};

/**
 * Servicios de CUO
 */
export const cuoApi = {
  // Obtener CUOs por contrato
  async getCuosByContrato(contratoId: number): Promise<CUO[]> {
    return apiRequest<CUO[]>(`/cuo/contrato/${contratoId}`);
  },
};

/**
 * Servicios de actividades (basados en la documentación de Swagger)
 */
export const actividadesApi = {
  // Crear una nueva actividad
  async create(data: Partial<Actividad>): Promise<Actividad> {
    return apiRequest<Actividad>('/actividades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener todas las actividades
  async getAll(): Promise<Actividad[]> {
    return apiRequest<Actividad[]>('/actividades');
  },

  // Obtener una actividad por ID
  async getById(id: number): Promise<Actividad> {
    return apiRequest<Actividad>(`/actividades/${id}`);
  },

  // Actualizar una actividad
  async update(id: number, data: Partial<Actividad>): Promise<Actividad> {
    return apiRequest<Actividad>(`/actividades/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Eliminar una actividad
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/actividades/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener actividades por CUO (Código Único de Obra)
  async getActividadesByCuo(cuoId: number): Promise<Actividad[]> {
    return apiRequest<Actividad[]>(`/actividades/cuo/${cuoId}`);
  },
};

/**
 * Servicios de seguimiento general
 */
export const seguimientoGeneralApi = {
  // Crear seguimiento general
  async create(data: Partial<SeguimientoGeneral>): Promise<SeguimientoGeneral> {
    return apiRequest<SeguimientoGeneral>('/seguimiento-general', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener seguimiento por ID
  async getById(id: number): Promise<SeguimientoGeneral> {
    return apiRequest<SeguimientoGeneral>(`/seguimiento-general/${id}`);
  },

  // Obtener seguimientos por contrato
  async getByContrato(contratoId: number): Promise<SeguimientoGeneral[]> {
    return apiRequest<SeguimientoGeneral[]>(`/seguimiento-general/contrato/${contratoId}`);
  },

  // Obtener seguimientos por número de contrato
  async getByNumeroContrato(numeroContrato: string): Promise<SeguimientoGeneral[]> {
    return apiRequest<SeguimientoGeneral[]>(`/seguimiento-general/contrato/numero/${numeroContrato}`);
  },
};

/**
 * Servicios de seguimiento de actividades
 */
export const seguimientoActividadApi = {
  // Crear seguimiento de actividad
  async create(data: Partial<SeguimientoActividad>): Promise<SeguimientoActividad> {
    return apiRequest<SeguimientoActividad>('/seguimiento-actividad', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener seguimiento por ID
  async getById(id: number): Promise<SeguimientoActividad> {
    return apiRequest<SeguimientoActividad>(`/seguimiento-actividad/${id}`);
  },

  // Obtener seguimientos por actividad
  async getByActividad(actividadId: number): Promise<SeguimientoActividad[]> {
    return apiRequest<SeguimientoActividad[]>(`/seguimiento-actividad/actividad/${actividadId}`);
  },
};

/**
 * Servicios de modificaciones
 */
export const modificacionesApi = {
  // Obtener todas las modificaciones
  async getAll(): Promise<Modificacion[]> {
    return apiRequest<Modificacion[]>('/modificaciones');
  },

  // Crear modificación
  async create(data: Partial<Modificacion>): Promise<Modificacion> {
    return apiRequest<Modificacion>('/modificaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener modificación por ID
  async getById(id: number): Promise<Modificacion> {
    return apiRequest<Modificacion>(`/modificaciones/${id}`);
  },

  // Actualizar modificación
  async update(id: number, data: Partial<Modificacion>): Promise<Modificacion> {
    return apiRequest<Modificacion>(`/modificaciones/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Eliminar modificación
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/modificaciones/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener modificaciones por contrato
  async getByContrato(contratoId: number): Promise<Modificacion[]> {
    return apiRequest<Modificacion[]>(`/modificaciones/contrato/${contratoId}`);
  },
};

/**
 * Servicios de adiciones
 */
export const adicionesApi = {
  // Obtener todas las adiciones
  async getAll(): Promise<Adicion[]> {
    return apiRequest<Adicion[]>('/adiciones');
  },

  // Crear adición
  async create(data: Partial<Adicion>): Promise<Adicion> {
    return apiRequest<Adicion>('/adiciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener adición por ID
  async getById(id: number): Promise<Adicion> {
    return apiRequest<Adicion>(`/adiciones/${id}`);
  },

  // Actualizar adición
  async update(id: number, data: Partial<Adicion>): Promise<Adicion> {
    return apiRequest<Adicion>(`/adiciones/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Eliminar adición
  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/adiciones/${id}`, {
      method: 'DELETE',
    });
  },

  // Obtener adiciones por contrato
  async getByContrato(contratoId: number): Promise<Adicion[]> {
    return apiRequest<Adicion[]>(`/adiciones/contrato/${contratoId}`);
  },
};

/**
 * Servicios de usuarios
 */
export const usuariosApi = {
  // Obtener supervisores reales desde los contratos existentes (no hay endpoint GET /usuarios)
  async getUsuarios(): Promise<Usuario[]> {
    try {
      // 1. Obtener todos los contratos para extraer cédulas de supervisores
      const contratos = await contratosApi.getContratos();
      const cedulasUnicas = new Set<string>();
      
      // 2. Extraer cédulas únicas de supervisores de contratos existentes
      contratos.forEach((contrato: any) => {
        if (contrato.usuarioCedula) {
          cedulasUnicas.add(contrato.usuarioCedula.toString());
        }
      });

      // 3. Obtener información detallada de cada supervisor desde la base de datos
      const supervisores: Usuario[] = [];
      for (const cedula of Array.from(cedulasUnicas)) {
        try {
          const usuario = await this.getUsuarioByCedula(cedula);
          if (usuario) {
            supervisores.push(usuario);
          }
        } catch (error) {
          console.warn(`No se pudo obtener información del supervisor ${cedula}:`, error);
        }
      }
      
      return supervisores;
    } catch (error) {
      console.error('Error obteniendo supervisores reales:', error);
      return [];
    }
  },

  // Obtener perfil del usuario actual
  async getProfile(): Promise<Usuario> {
    return apiRequest<Usuario>('/usuarios/perfil/me');
  },

  // Obtener usuario por cédula
  async getUsuarioByCedula(cedula: string): Promise<Usuario> {
    return apiRequest<Usuario>(`/usuarios/${cedula}`);
  },

  // Crear un nuevo usuario
  async createUsuario(data: Partial<Usuario>): Promise<Usuario> {
    return apiRequest<Usuario>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Función para verificar si el backend está disponible
 */
export async function checkBackendConnection(): Promise<boolean> {
  try {
    await authApi.healthCheck();
    return true;
  } catch {
    return false;
  }
}

const apiExports = {
  authApi,
  contratosApi,
  cuoApi,
  actividadesApi,
  seguimientoGeneralApi,
  seguimientoActividadApi,
  modificacionesApi,
  adicionesApi,
  usuariosApi,
  checkBackendConnection,
};

export default apiExports; 