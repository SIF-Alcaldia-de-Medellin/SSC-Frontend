const sscData = {
    "contratos": [
      {
        "id": 0,
        "numeroContrato": "4600104038",
        "anoSuscripcion": 2025,
        "programa": "string",
        "tipoContrato": "INTERADMINISTRATIVO",
        "objeto": "CONTRATO INTERADMINISTRATIVO DE MANDATO SIN REPRESENTACIÓN PARA LA OPERACIÓN, MANTENIMIENTO Y ADMINISTRACIÓN DEL CABLE DE SAN SEBASTIÁN DE PALMITAS",
        "identificadorSimple": "string",
        "suplentes": "string",
        "apoyo": "string",
        "estado": "activo",
        "contratista": "TERMINALES DE TRANSPORTE MEDELLIN S.A.",
        "numeroProceso": "string",
        "fechaInicio": "2025-07-02T03:15:11.635Z",
        "fechaTerminacionInicial": "2025-07-02T03:15:11.635Z",
        "fechaTerminacionActual": "2025-07-02T03:15:11.635Z",
        "valorInicial": 0,
        "valorTotal": 100000000000,
        "supervisor": {}
      },
      {
        "id": 1,
        "numeroContrato": "4600104039",
        "anoSuscripcion": 2025,
        "programa": "string",
        "tipoContrato": "INTERVENTORIA",
        "objeto": "CONTRATO INTERADMINISTRATIVO DE MANDATO SIN REPRESENTACIÓN PARA LA OPERACIÓN, MANTENIMIENTO Y ADMINISTRACIÓN DEL CABLE DE SAN SEBASTIÁN DE PALMITAS",
        "identificadorSimple": "string",
        "suplentes": "string",
        "apoyo": "string",
        "estado": "activo",
        "contratista": "string",
        "numeroProceso": "string",
        "fechaInicio": "2025-07-02T03:15:11.635Z",
        "fechaTerminacionInicial": "2025-07-02T03:15:11.635Z",
        "fechaTerminacionActual": "2025-07-02T03:15:11.635Z",
        "valorInicial": 0,
        "valorTotal": 90000000000,
        "supervisor": {}
      }
    ],
    "adiciones": [
      {
        "id": 0,
        "contratoId": 0,
        "contrato": {},
        "valorAdicion": 150000000,
        "fecha": "2024-03-15",
        "createdAt": "2024-03-15T10:30:00Z",
        "observaciones": "Se requiere adición presupuestal para cubrir actividades adicionales..."
      },
      {
        "id": 1,
        "contratoId": 0,
        "contrato": {},
        "valorAdicion": 150000000,
        "fecha": "2024-03-15",
        "createdAt": "2024-03-15T10:30:00Z",
        "observaciones": "Se requiere adición presupuestal para cubrir actividades adicionales..."
      }
    ],
    "modificaciones": [
      {
        "id": 0,
        "contratoId": 0,
        "contrato": {},
        "tipo": "SUSPENSION",
        "fechaInicio": "2024-03-15",
        "fechaFinal": "2024-04-15",
        "duracion": 30,
        "createdAt": "2024-03-14T10:30:00Z",
        "observaciones": "Suspensión por temporada de lluvias que impide la ejecución segura de las obras."
      }, 
      {
        "id": 1,
        "contratoId": 0,
        "contrato": {},
        "tipo": "AMPLIACION",
        "fechaInicio": "2024-03-15",
        "fechaFinal": "2024-04-15",
        "duracion": 30,
        "createdAt": "2024-03-14T10:30:00Z",
        "observaciones": "Suspensión por temporada de lluvias que impide la ejecución segura de las obras."
      }
      
    ],
    "seguimiento_general": [
      {
        "id": 0,
        "contratoId": 0,
        "contrato": {},
        "valorEjecutado": 150000000,
        "avanceFinanciero": 45.75,
        "avanceFisico": 42.3,
        "createdAt": "2024-03-15T10:30:00Z",
        "fechaUltimaModificacion": "2024-03-15T10:30:00Z",
        "observaciones": "El avance del contrato se encuentra dentro de lo programado...",
        "diferenciaAvance": -3.45,
        "estadoAvance": "NORMAL",
        "resumenEstado": "NORMAL: Avance físico 42.30% vs. financiero 45.75% (diferencia: -3.45%). Valor ejecutado: $150.000.000 de $328.000.000"
      },
      {
        "id": 1,
        "contratoId": 0,
        "contrato": {},
        "valorEjecutado": 150000000,
        "avanceFinanciero": 45.75,
        "avanceFisico": 42.3,
        "createdAt": "2024-03-15T10:30:00Z",
        "fechaUltimaModificacion": "2024-03-15T10:30:00Z",
        "observaciones": "El avance del contrato se encuentra dentro de lo programado...",
        "diferenciaAvance": -3.45,
        "estadoAvance": "NORMAL",
        "resumenEstado": "NORMAL: Avance físico 42.30% vs. financiero 45.75% (diferencia: -3.45%). Valor ejecutado: $150.000.000 de $328.000.000"
      },
    ],
    "cuos": [
      {
        "id": 0,
        "contratoId": 0,
        "contrato": {},
        "numero": "20250101",
        "latitud": 90,
        "longitud": 180,
        "comuna": "Candelaria",
        "barrio": "San Antonio",
        "descripcion": "Loren ipsum dolor sit amet Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "cantidadActividades": 10
      },
      {
        "id": 0,
        "contratoId": 0,
        "contrato": {},
        "numero": "20250101",
        "latitud": 90,
        "longitud": 180,
        "comuna": "Candelaria",
        "barrio": "San Antonio",
        "descripcion": "Loren ipsum dolor sit amet Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "cantidadActividades": 5
      }
    ],
    "actividades": [
      {
        "id": 0,
        "cuoId": 0,
        "actividad": "Mantenimiento de andenes",
        "metaFisica": 0,
        "proyectadoFinanciero": 0,
        "unidadesAvance": "Metros cuadrados",
        "cuo": {}
      },
      {
        "id": 1,
        "cuoId": 0,
        "actividad": "Mantenimiento Malla vial",
        "metaFisica": 0,
        "proyectadoFinanciero": 0,
        "unidadesAvance": "Metros cuadrados",
        "cuo": {}
      },
      {
        "id": 1,
        "cuoId": 1,
        "actividad": "Mantenimiento espacios publicos",
        "metaFisica": 0,
        "proyectadoFinanciero": 0,
        "unidadesAvance": "Unidades",
        "cuo": {}
      },
    ]
  };
  
  export default sscData; 