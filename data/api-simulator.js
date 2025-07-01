import sscData from './ssc_data.json';

/**
 * Simulador de API para el Sistema SSC
 * Simula las operaciones CRUD que el frontend necesita
 */

// Copia local de los datos para simular persistencia
let localData = JSON.parse(JSON.stringify(sscData));

// Delay artificial para simular latencia de red
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * USUARIOS
 */
export const usuariosAPI = {
  // Obtener todos los usuarios
  getAll: async () => {
    await delay();
    return { success: true, data: localData.usuarios };
  },

  // Obtener usuario por cédula
  getByCedula: async (cedula) => {
    await delay();
    const usuario = localData.usuarios.find(u => u.USU_CEDULA == cedula);
    return usuario 
      ? { success: true, data: usuario }
      : { success: false, message: 'Usuario no encontrado' };
  },

  // Autenticar usuario
  authenticate: async (email, password) => {
    await delay();
    const usuario = localData.usuarios.find(u => u.USU_EMAIL === email);
    return usuario 
      ? { success: true, data: usuario, token: 'mock_jwt_token' }
      : { success: false, message: 'Credenciales inválidas' };
  }
};

/**
 * CONTRATOS
 */
export const contratosAPI = {
  // Obtener todos los contratos
  getAll: async () => {
    await delay();
    return { success: true, data: localData.contratos };
  },

  // Obtener contratos activos
  getActivos: async () => {
    await delay();
    const activos = localData.contratos.filter(c => c.CON_ESTADO === 'ACTIVO');
    return { success: true, data: activos };
  },

  // Obtener contrato por ID
  getById: async (id) => {
    await delay();
    const contrato = localData.contratos.find(c => c.CON_ID == id);
    if (!contrato) {
      return { success: false, message: 'Contrato no encontrado' };
    }

    // Incluir datos relacionados
    const adiciones = localData.adiciones.filter(a => a.ADI_CON_ID == id);
    const modificaciones = localData.modificaciones.filter(m => m.MOD_CON_ID == id);
    const seguimiento = localData.seguimiento_general.find(s => s.SEG_CON_ID == id);
    const usuario = localData.usuarios.find(u => u.USU_CEDULA == contrato.CON_USU_CEDULA);

    return {
      success: true,
      data: {
        ...contrato,
        adiciones,
        modificaciones,
        seguimiento,
        usuario
      }
    };
  },

  // Obtener contrato por número
  getByNumero: async (numero) => {
    await delay();
    const contrato = localData.contratos.find(c => c.CON_NRO_CONTRATO == numero);
    return contrato 
      ? { success: true, data: contrato }
      : { success: false, message: 'Contrato no encontrado' };
  }
};

/**
 * SEGUIMIENTO GENERAL
 */
export const seguimientoAPI = {
  // Obtener seguimiento por contrato
  getByContrato: async (contratoId) => {
    await delay();
    const seguimientos = localData.seguimiento_general.filter(s => s.SEG_CON_ID == contratoId);
    return { success: true, data: seguimientos };
  },

  // Crear nuevo seguimiento
  create: async (seguimientoData) => {
    await delay();
    const nuevoId = Math.max(...localData.seguimiento_general.map(s => s.SEG_ID)) + 1;
    const nuevoSeguimiento = {
      SEG_ID: nuevoId,
      SEG_CREATED_AT: new Date().toISOString(),
      ...seguimientoData
    };
    localData.seguimiento_general.push(nuevoSeguimiento);
    return { success: true, data: nuevoSeguimiento };
  },

  // Obtener último seguimiento por contrato
  getUltimo: async (contratoId) => {
    await delay();
    const seguimientos = localData.seguimiento_general
      .filter(s => s.SEG_CON_ID == contratoId)
      .sort((a, b) => new Date(b.SEG_CREATED_AT) - new Date(a.SEG_CREATED_AT));
    
    return seguimientos.length > 0 
      ? { success: true, data: seguimientos[0] }
      : { success: false, message: 'No hay seguimiento registrado' };
  }
};

/**
 * ADICIONES
 */
export const adicionesAPI = {
  // Obtener adiciones por contrato
  getByContrato: async (contratoId) => {
    await delay();
    const adiciones = localData.adiciones.filter(a => a.ADI_CON_ID == contratoId);
    return { success: true, data: adiciones };
  },

  // Crear nueva adición
  create: async (adicionData) => {
    await delay();
    const nuevoId = Math.max(...localData.adiciones.map(a => a.ADI_ID)) + 1;
    const nuevaAdicion = {
      ADI_ID: nuevoId,
      ADI_CREATED_AT: new Date().toISOString(),
      ...adicionData
    };
    localData.adiciones.push(nuevaAdicion);

    // Actualizar valor total del contrato
    const contrato = localData.contratos.find(c => c.CON_ID == adicionData.ADI_CON_ID);
    if (contrato) {
      contrato.CON_VALOR_TOTAL += adicionData.ADI_VALOR_ADICION;
    }

    return { success: true, data: nuevaAdicion };
  },

  // Obtener total de adiciones por contrato
  getTotalByContrato: async (contratoId) => {
    await delay();
    const adiciones = localData.adiciones.filter(a => a.ADI_CON_ID == contratoId);
    const total = adiciones.reduce((sum, a) => sum + a.ADI_VALOR_ADICION, 0);
    return { success: true, data: { total, cantidad: adiciones.length } };
  }
};

/**
 * MODIFICACIONES
 */
export const modificacionesAPI = {
  // Obtener modificaciones por contrato
  getByContrato: async (contratoId) => {
    await delay();
    const modificaciones = localData.modificaciones.filter(m => m.MOD_CON_ID == contratoId);
    return { success: true, data: modificaciones };
  },

  // Crear nueva modificación
  create: async (modificacionData) => {
    await delay();
    const nuevoId = Math.max(...localData.modificaciones.map(m => m.MOD_ID)) + 1;
    const nuevaModificacion = {
      MOD_ID: nuevoId,
      MOD_CREATED_AT: new Date().toISOString(),
      ...modificacionData
    };
    localData.modificaciones.push(nuevaModificacion);

    // Si es modificación de plazo, actualizar fecha del contrato
    if (modificacionData.MOD_TIPO === 'PLAZO') {
      const contrato = localData.contratos.find(c => c.CON_ID == modificacionData.MOD_CON_ID);
      if (contrato && modificacionData.MOD_FECHA_FINAL) {
        contrato.CON_FECHA_TER_ACT = modificacionData.MOD_FECHA_FINAL;
      }
    }

    return { success: true, data: nuevaModificacion };
  }
};

/**
 * ESTADÍSTICAS Y REPORTES
 */
export const estadisticasAPI = {
  // Dashboard general
  getDashboard: async () => {
    await delay();
    const contratos = localData.contratos;
    const activos = contratos.filter(c => c.CON_ESTADO === 'ACTIVO');
    const terminados = contratos.filter(c => c.CON_ESTADO === 'TERMINADO');
    const valorTotal = contratos.reduce((sum, c) => sum + c.CON_VALOR_TOTAL, 0);
    const totalAdiciones = localData.adiciones.reduce((sum, a) => sum + a.ADI_VALOR_ADICION, 0);

    return {
      success: true,
      data: {
        total_contratos: contratos.length,
        contratos_activos: activos.length,
        contratos_terminados: terminados.length,
        valor_total: valorTotal,
        valor_adiciones: totalAdiciones,
        ultima_actualizacion: new Date().toISOString()
      }
    };
  },

  // Avance promedio de contratos activos
  getAvancePromedio: async () => {
    await delay();
    const contratosActivos = localData.contratos.filter(c => c.CON_ESTADO === 'ACTIVO');
    const seguimientos = localData.seguimiento_general
      .filter(s => contratosActivos.some(c => c.CON_ID === s.SEG_CON_ID));
    
    if (seguimientos.length === 0) {
      return { success: true, data: { avance_financiero: 0, avance_fisico: 0 } };
    }

    const promedioFinanciero = seguimientos.reduce((sum, s) => sum + s.SEG_AVANCE_FINANCIERO, 0) / seguimientos.length;
    const promedioFisico = seguimientos.reduce((sum, s) => sum + s.SEG_AVANCE_FISICO, 0) / seguimientos.length;

    return {
      success: true,
      data: {
        avance_financiero: Math.round(promedioFinanciero),
        avance_fisico: Math.round(promedioFisico)
      }
    };
  }
};

/**
 * UTILIDADES
 */
export const utilidadesAPI = {
  // Obtener tipos de contrato
  getTiposContrato: async () => {
    await delay();
    return { success: true, data: localData.tipos_contrato };
  },

  // Obtener estados de contrato
  getEstadosContrato: async () => {
    await delay();
    return { success: true, data: localData.estados_contrato };
  },

  // Obtener tipos de modificación
  getTiposModificacion: async () => {
    await delay();
    return { success: true, data: localData.tipos_modificacion };
  },

  // Formatear valor monetario
  formatearValor: (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  },

  // Formatear fecha
  formatearFecha: (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Calcular días restantes
  calcularDiasRestantes: (fechaFinal) => {
    const hoy = new Date();
    const final = new Date(fechaFinal);
    const diferencia = final - hoy;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }
};

/**
 * EXPORT DEFAULT CON TODAS LAS APIs
 */
export default {
  usuarios: usuariosAPI,
  contratos: contratosAPI,
  seguimiento: seguimientoAPI,
  adiciones: adicionesAPI,
  modificaciones: modificacionesAPI,
  estadisticas: estadisticasAPI,
  utilidades: utilidadesAPI,
  
  // Método para reiniciar datos
  resetData: () => {
    localData = JSON.parse(JSON.stringify(sscData));
  },
  
  // Método para obtener todos los datos actuales
  getAllData: () => localData
}; 